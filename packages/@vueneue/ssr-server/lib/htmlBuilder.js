const jsonEncode = require('fast-safe-stringify');

module.exports = async (serverContext, ssrContext, html) => {
  const { template, critters, cssFiles } = serverContext;

  let body = html;
  let head = '';
  let bodyAttrs = '';
  let htmlAttrs = '';

  // Add Vuex and components data
  body += `<script data-vue-ssr-data>window.__DATA__=${jsonEncode(
    ssrContext.data,
  )}</script>`;

  // Body additions
  if (typeof ssrContext.bodyAdd === 'string') {
    body += ssrContext.bodyAdd;
  }

  /**
   * Handle vue-meta
   */
  if (ssrContext.meta) {
    const metas = ssrContext.meta.inject();

    bodyAttrs = metas.bodyAttrs.text();
    htmlAttrs = metas.htmlAttrs.text();

    // Inject metas to head
    head =
      metas.meta.text() +
      metas.title.text() +
      metas.link.text() +
      metas.style.text() +
      metas.script.text() +
      metas.noscript.text();
  }

  // Build head
  if (ssrContext.headAdd) head += ssrContext.headAdd;

  // Handle styles
  head += ssrContext.renderStyles();

  // Resource hints
  head += ssrContext.renderResourceHints();

  // Build body
  body += ssrContext.renderScripts();

  // Body additions
  if (typeof ssrContext.bodyAdd === 'string') {
    body += ssrContext.bodyAdd;
  }

  // Replace final html
  let result = template
    .replace(/data-html-attrs(="")?/, htmlAttrs)
    .replace(/data-body-attrs(="")?/, bodyAttrs)
    .replace(/<ssr-head\/?>/, head)
    .replace(/<ssr-body\/?>/, body)
    .replace('</ssr-head>', '')
    .replace('</ssr-body>', '');

  // Run critical CSS
  if (critters) {
    result = await critters.process(result, cssFiles);
  }

  return result;
};
