module.exports = serverContext => {
  return serverContext.templateSpa.replace('<ssr-head>', '').replace(
    '<ssr-body>',
    `<div id="app"></div>
      <script data-vue-spa>window.__SPA_ROUTE__=true;</script>`,
  );
};
