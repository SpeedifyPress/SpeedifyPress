import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const isWatchMode = process.argv.includes('--watch');
const pluginType = process.env.VITE_PLUGIN_TYPE === 'wordpressorg' ? 'wordpressorg' : 'community';

const candidateInputTargets = {
  index: path.resolve(__dirname, 'index.html'),
  usage_collector: path.resolve(__dirname, '../assets/usage_collector/usage_collector.js'),
  js_delay: path.resolve(__dirname, '../assets/js_delay/js_delay.js'),
  onload: path.resolve(__dirname, '../assets/onload/onload.js'),
  instant_page: path.resolve(__dirname, 'node_modules/instant.page/instantpage.js'),
};

const inputTargets = Object.fromEntries(
  Object.entries(candidateInputTargets).filter(([name, targetPath]) =>
    fs.existsSync(targetPath) && (pluginType !== 'wordpressorg' || ['index', 'usage_collector', 'instant_page'].includes(name))
  )
);

// Keep the shared layout, excluding unrelated screens only when building SpeedifyCSS.
function wordpressOrgAdminExclusions() {
  return {
    name: 'wordpressorg-admin-exclusions',
    enforce: 'pre',
    transform(source, id) {
      if (pluginType !== 'wordpressorg' || !id.replace(/\\/g, '/').endsWith('/src/App.vue')) return;
      return {
        code: source
          .replace(/^import (?:JavascriptSettings|ImageSettings|FontSettings|ExternalScripts|BloatSettings)(?:Doc)? from [^\r\n]+\r?\n/gm, '')
          .replace(/^\s*\{ name: '(?:JavaScript Settings|Image Settings|Font Settings|External Scripts|Bloat Remover)'[^\r\n]*\r?\n/gm, '')
          .replace('>SpeedifyPress</span>', '>SpeedifyCSS</span>'),
        map: null,
      };
    },
  };
}

function logAndCopyFilesPlugin(copyTargets) {
  return {
    name: 'log-and-copy-files',
    apply: 'build',
    async closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const target of copyTargets) {
        const files = await fg(target.src, { ignore: target.ignore });
        for (const file of files) {
          const relativePath = target.flatten ? path.basename(file) : path.relative(target.base || distDir, file);
          const destFile = path.resolve(target.dest, relativePath);

          if (target.wrap !== false && path.extname(file) === '.js' && !/umd/i.test(path.basename(file))) {
            let content = await fs.readFile(file, 'utf-8');
            if (content.endsWith('\n')) {
              content = content.slice(0, -1);
            }
            content = `(function(){${content}})();`;
            await fs.outputFile(destFile, content);
            console.log(`Processed JavaScript file: ${file} -> ${destFile}`);
          } else {
            await fs.copy(file, destFile);
            console.log(`Copied: ${file} -> ${destFile}`);
          }
        }
      }
    },
  };
}

const copyTargets = [
  // Include notices in dist before copying the complete asset output into the plugin.
  {
    src: path.resolve(__dirname, '../assets/licenses/**/*'),
    base: path.resolve(__dirname, '../assets/licenses'),
    dest: path.resolve(__dirname, 'dist/assets/licenses'),
  },
  {
    src: path.resolve(__dirname, 'dist/assets/**/*'),
    dest: path.resolve(__dirname, '../'),
  },
  // Keep lazy imports at their emitted paths and preserve module syntax unchanged.
  {
    src: path.resolve(__dirname, 'dist/chunks/**/*'),
    dest: path.resolve(__dirname, '../'),
    wrap: false,
  },
  {
    src: path.resolve(__dirname, 'dist/*'),
    dest: path.resolve(__dirname, '../assets'),
    ignore: ['**/vite.svg', '**/index.html'],
  },
  {
    src: path.resolve(__dirname, 'node_modules/quicklink/dist/quicklink.umd.js'),
    dest: path.resolve(__dirname, '../assets/quicklink'),
    flatten: true,
  },
];

export default defineConfig({
  define: {
    __PLUGIN_TYPE__: JSON.stringify(pluginType),
  },
  plugins: [
    wordpressOrgAdminExclusions(),
    vue(),
    logAndCopyFilesPlugin(copyTargets),
  ],
  build: {
    ...(isWatchMode ? { watch: {} } : {}),
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: {
        keep_classnames: true,
      },
      output: {
        comments: false,
      },
    },
    rollupOptions: {
      input: inputTargets,
      output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: (chunk) => {
          if (chunk.name === 'index') {
            return 'assets/admin/admin.min.js';
          }
          const name = chunk.name;
          const basename = name.split('/').pop();
          return `assets/${name}/${basename}.min.js`;
        },
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (chunk) => {
          if (chunk.name === 'index.css') {
            return 'assets/admin/admin.min.[ext]';
          }
          const name = chunk.name.replace(/_css\.css/g, '');
          return `assets/${name}/${name}.min.[ext]`;
        },
      },
    },
  },
});
