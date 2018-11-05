module.exports = serverContext => {
  return serverContext.templateSpa
    .replace(/<ssr-head\s*\/?>/, '')
    .replace(
      /<ssr-body\s*\/?>/,
      `<div id="app"></div>
      <script data-vue-spa>window.__SPA_ROUTE__=true;</script>`,
    )
    .replace('</ssr-head>', '')
    .replace('</ssr-body>', '');
};
