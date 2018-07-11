module.exports = source => {
  const { Recast, RQuery } = require('@vueneue/rquery');

  const doc = RQuery.parse(source);

  // Remove Vue import
  const importVue = doc.find('import#Vue@vue')[0];
  if (importVue) importVue.remove();

  // Convert export to arrow function
  const router = doc.find('exportDefault new#Router')[0];
  if (router && router.parent().node.type === 'ExportDefaultDeclaration') {
    router.replace(`() => { return ${Recast.print(router.node)}; }`);

    // Add mode to router if not exists
    const routerOptions = router.find('{}')[0];
    const modeProp = routerOptions.get('mode');
    if (!modeProp) {
      routerOptions.set(
        'mode',
        Recast.parse(`process.ssr ? 'history' : 'hash'`).program.body[0]
          .expression,
        0,
      );
    }
  }

  // Remove Vue.use
  const vueUse = doc.find('Vue.use')[0];
  if (vueUse) {
    vueUse.parentType('ExpressionStatement').remove();
  }

  return RQuery.print(doc);
};
