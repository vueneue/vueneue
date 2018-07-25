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

    body += metas.script.text(bodyOpt);
  }

  body += `<script data-vue-ssr-data>window.__DATA__=${jsonEncode({
    state: ssrContext.state,
    components: ssrContext.asyncData,
  })}</script>`;

  // Replace final html
  let result = serverContext.template
    .replace(/data-html-attrs(="")?/, htmlAttrs)
    .replace(/data-body-attrs(="")?/, bodyAttrs)
    .replace('<ssr-head>', head)
    .replace('<ssr-body>', body);

  return result;
};
