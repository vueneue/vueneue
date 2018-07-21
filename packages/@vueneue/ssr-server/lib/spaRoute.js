module.exports = serverContext => {
  return serverContext.template
    .replace('<ssr-head>', '')
    .replace('<ssr-body>', '<div id="app"></div>')
    .replace(
      '</body>',
      `<script data-vue-ssr-data>window.__DATA__={"spa":true,"components":[],"state":{}}</script></body>`,
    );
};
