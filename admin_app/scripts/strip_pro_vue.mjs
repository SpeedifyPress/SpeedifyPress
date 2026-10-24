import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseSfc } from '@vue/compiler-sfc';
import { parse as parseTemplate, NodeTypes } from '@vue/compiler-dom';
import { parseExpression } from '@babel/parser';

/** Resolve edition guards without evaluating unrelated runtime expressions. */
function simplifyGuard(expression) {

  function simplify(node) {

    const text = expression.slice(node.start, node.end);
    if (node.type === 'Identifier' && ['isPro', 'isProBuild'].includes(node.name)) return false;
    if (node.type === 'BooleanLiteral') return node.value;
    if (node.type === 'UnaryExpression' && node.operator === '!') {
      const value = simplify(node.argument);
      return typeof value === 'boolean' ? !value : `!(${value})`;
    }
    if (node.type === 'LogicalExpression' && ['&&', '||'].includes(node.operator)) {
      const left = simplify(node.left);
      const right = simplify(node.right);
      if (node.operator === '&&') {
        if (left === false || right === false) return false;
        if (left === true) return right;
        if (right === true) return left;
      } else {
        if (left === true || right === true) return true;
        if (left === false) return right;
        if (right === false) return left;
      }
      return `(${left}) ${node.operator} (${right})`;
    }

    // Fail visibly if a new guard needs handling rather than silently retaining Pro controls.
    if (/\bisPro(?:Build)?\b/.test(text)) throw new Error(`Unsupported edition guard: ${expression}`);
    return text;
  }
  return simplify(parseExpression(expression));
}

/** Strip disabled template branches using parser offsets, preserving the original source formatting. */
export function stripProVue(source, filename = 'component.vue') {

  const { descriptor, errors } = parseSfc(source, { filename });
  if (errors.length) throw new Error(`${filename}: ${errors.join(', ')}`);
  if (!descriptor.template) return source;
  const template = descriptor.template;
  const ast = parseTemplate(template.content);
  const edits = [];
  const guard = node => node.props?.find(prop => prop.type === NodeTypes.DIRECTIVE && ['if', 'else-if', 'else'].includes(prop.name));
  const edit = (loc, text = '') => edits.push([template.loc.start.offset + loc.start.offset, template.loc.start.offset + loc.end.offset, text]);

  function walk(children) {

    for (let index = 0; index < children.length; index++) {
      const node = children[index];
      if (node.type !== NodeTypes.ELEMENT) continue;
      const directive = guard(node);
      if (directive?.name !== 'if') {
        walk(node.children);
        continue;
      }

      // Gather adjacent conditional siblings, including comments/whitespace between branches.
      const branches = [node];
      let end = index;
      for (let next = index + 1; next < children.length; next++) {
        const sibling = children[next];
        if (sibling.type === NodeTypes.COMMENT || (sibling.type === NodeTypes.TEXT && !sibling.content.trim())) continue;
        if (!['else-if', 'else'].includes(guard(sibling)?.name)) break;
        branches.push(sibling);
        end = next;
      }
      if (!branches.some(branch => /\bisPro(?:Build)?\b/.test(guard(branch).exp?.content ?? ''))) {
        for (const branch of branches) walk(branch.children);
        index = end;
        continue;
      }

      let hasConditional = false;
      let complete = false;
      for (const branch of branches) {
        const condition = guard(branch);
        const value = condition.name === 'else' ? true : simplifyGuard(condition.exp.content);
        if (complete || value === false) {
          edit(branch.loc);
          continue;
        }

        // Promote surviving fallback branches so removing v-if never leaves an orphaned v-else.
        if (value === true) {
          edit(condition.loc, hasConditional ? 'v-else' : '');
          complete = true;
        } else {
          const escaped = value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
          edit(condition.loc, `v-${hasConditional ? 'else-if' : 'if'}="${escaped}"`);
          hasConditional = true;
        }
        walk(branch.children);
      }
      index = end;
    }
  }

  walk(ast.children);

  // Apply edits backwards so deleting nested sections cannot shift subsequent source offsets.
  edits.sort((a, b) => b[0] - a[0]);
  for (const [start, end, replacement] of edits) source = source.slice(0, start) + replacement + source.slice(end);
  return source;
}

/** Process only the staged Vue workspace; the original components are never modified. */
function stripDirectory(directory) {

  let count = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) count += stripDirectory(filename);
    if (!entry.isFile() || !filename.endsWith('.vue')) continue;
    const source = fs.readFileSync(filename, 'utf8');
    const stripped = stripProVue(source, filename);
    if (source !== stripped) {
      fs.writeFileSync(filename, stripped);
      count++;
    }
  }
  return count;
}

/** Extract complete Community doc HTML using the same edition guards as packaged Vue components. */
export function communityDocTemplate(source, filename = 'doc.vue') {

  const { descriptor } = parseSfc(stripProVue(source, filename), { filename });
  if (!descriptor.template) throw new Error(`Missing documentation template: ${filename}`);
  let html = descriptor.template.content;
  const edits = [];
  function unwrap(children) {

    for (const node of children) {
      if (node.type !== NodeTypes.ELEMENT) continue;
      if (node.tag === 'template') {

        // Template wrappers are inert in HTML; keep their surviving contents visible in published docs.
        const lastProp = node.props.at(-1);
        const openingEnd = html.indexOf('>', lastProp?.loc.end.offset ?? node.loc.start.offset) + 1;
        edits.push([node.loc.start.offset, openingEnd]);
        if (!node.isSelfClosing) edits.push([node.loc.start.offset + node.loc.source.lastIndexOf('</template'), node.loc.end.offset]);
      }
      unwrap(node.children);
    }
  }
  unwrap(parseTemplate(html).children);
  for (const [start, end] of edits.sort((a, b) => b[0] - a[0])) html = html.slice(0, start) + html.slice(end);
  return html;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === '--docs') {
    if (!process.argv[3]) throw new Error('Documentation directory is required');
    const templates = {};
    for (const name of fs.readdirSync(process.argv[3]).filter(name => name.endsWith('.vue'))) {
      const filename = path.join(process.argv[3], name);
      templates[name] = communityDocTemplate(fs.readFileSync(filename, 'utf8'), filename);
    }
    console.log(JSON.stringify(templates));
  } else {
    if (!process.argv[2]) throw new Error('Staged Vue source directory is required');
    console.log(`Stripped Pro template branches from ${stripDirectory(process.argv[2])} Vue files`);
  }
}
