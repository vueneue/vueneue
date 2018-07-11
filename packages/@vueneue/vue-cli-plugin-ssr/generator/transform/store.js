module.exports = source => {
  const { Recast, RQuery } = require('@vueneue/rquery');

  const doc = RQuery.parse(source);

  // Remove Vue import
  const importVue = doc.find('import#Vue@vue')[0];
  if (importVue) importVue.remove();

  // Convert export to arrow function
  const store = doc.find('exportDefault new#Vuex.Store')[0];
  if (store && store.parent().node.type === 'ExportDefaultDeclaration') {
    store.replace(`() => { return ${Recast.print(store.node)}; }`);
  }

  // Remove Vue.use
  const vueUse = doc.find('Vue.use')[0];
  if (vueUse) {
    vueUse.parentType('ExpressionStatement').remove();
  }

  return RQuery.print(doc);
};
