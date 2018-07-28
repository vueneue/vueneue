const jsonEncode = require('fast-safe-stringify');

module.exports = async (serverContext, ssrContext, html) => {
  // Metas
  const bodyOpt = { body: true };

  let body = html;
  let head = '';
  let bodyAttrs = '';
  let htmlAttrs = '';

  /**
   * Handle vue-meta
   */
  if (ssrContext.meta) {
    const metas = ssrContext.meta.inject();

    bodyAttrs = metas.bodyAttrs.text();
    htmlAttrs = metas.htmlAttrs.text();

    head =
      metas.meta.text() +
      metas.title.text() +
      metas.link.text() +
      metas.style.text() +
      metas.script.text() +
      metas.noscript.text();

    if (ssrContext.styles) {
      head += ssrContext.styles;
    }

    body += metas.script.text(bodyOpt);
  }

  // Add Vuex and components data
  body += `<script data-vue-ssr-data>window.__DATA__=${jsonEncode(
    ssrContext.data,
  )}</script>`;

  // Body additions
  if (ssrContext.bodyAdd) {
    body += ssrContext.bodyAdd;
  }

  // Replace final html
  let result = serverContext.template
    .replace(/data-html-attrs(="")?/, htmlAttrs)
    .replace(/data-body-attrs(="")?/, bodyAttrs)
    .replace('<ssr-head>', head)
    .replace('<ssr-body>', body);

  return result;
};
