// React 19 no longer ships UMD files. Bundle the actual installed runtime for
// offline browser tests; component and behavior assertions remain unchanged.
const { buildSync } = require('esbuild');
const path = require('node:path');
let script;
async function installReact(page) {
  script ||= buildSync({
    stdin: { contents: "import * as React from 'react'; import { createRoot } from 'react-dom/client'; window.React = React; window.ReactDOM = { createRoot };",
      resolveDir: path.resolve(__dirname, '../..'), sourcefile: 'synthetic-react-browser.js' },
    bundle: true, write: false, platform: 'browser', format: 'iife',
    define: { 'process.env.NODE_ENV': '"development"' },
  }).outputFiles[0].text;
  await page.addScriptTag({ content: script });
}
module.exports = { installReact };
