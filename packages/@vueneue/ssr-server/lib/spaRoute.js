module.exports = serverContext => {
  return serverContext.template
    .replace('<ssr-head>', '')
    .replace('<ssr-body>', '<div id="app"></div>')
    .replace(
      '</body>',
      `<script data-vue-spa>window.__SPA_ROUTE__=true;</script></body>`,
    );
};
