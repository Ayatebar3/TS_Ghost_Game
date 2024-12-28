import * as esbuild from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';

const port = 4500;

const settings = {
  entryPoints: ['./src/index.ts'],
  outfile: 'www/index.js',
  bundle: true,
  plugins: [
    esbuildPluginTsc({
      force: true
    }),
  ],
};

const ctx = await esbuild.context({
  ...settings,
  minify: true,
  treeShaking: true,
  sourcemap: false,
});

await ctx.watch();

await ctx.serve({
  port: port,
  servedir: 'www',
  fallback: 'www/index.html'
});

console.log("Watching for changes in ./src");
console.log(`serving at http://localhost:${port}`);
