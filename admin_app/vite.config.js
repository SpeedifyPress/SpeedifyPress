import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fg from 'fast-glob';
import fs from 'fs-extra';

const isWatchMode = process.argv.includes('--watch');

const candidateInputTargets = {
  index: path.resolve(__dirname, 'index.html'),
  usage_collector: path.resolve(__dirname, '../assets/usage_collector/usage_collector.js'),
  js_delay: path.resolve(__dirname, '../assets/js_delay/js_delay.js'),
  onload: path.resolve(__dirname, '../assets/onload/onload.js'),
  instant_page: path.resolve(__dirname, 'node_modules/instant.page/instantpage.js'),
};

const inputTargets = Object.fromEntries(
  Object.entries(candidateInputTargets).filter(([, targetPath]) => fs.existsSync(targetPath))
);

function logAndCopyFilesPlugin(copyTargets) {
  return {
    name: 'log-and-copy-files',
    apply: 'build',
    async closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const target of copyTargets) {
        const files = await fg(target.src, { ignore: target.ignore });
        for (const file of files) {
          const relativePath = target.flatten ? path.basename(file) : path.relative(distDir, file);
          const destFile = path.resolve(target.dest, relativePath);

          if (path.extname(file) === '.js' && !/umd/i.test(path.basename(file))) {
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
  {
    src: path.resolve(__dirname, 'dist/assets/**/*'),
    dest: path.resolve(__dirname, '../'),
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
  resolve: {
    alias: {
      '@pro-admin-items': path.resolve(__dirname, 'src/proAdminItems.stub.js'),
    },
  },
  define: {
    __PLUGIN_TYPE__: JSON.stringify('community'),
  },
  plugins: [
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
