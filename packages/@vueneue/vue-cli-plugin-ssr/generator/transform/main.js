module.exports = source => {
  const { Recast, RQuery } = require('@vueneue/rquery');

  const doc = RQuery.parse(source);

  // Remove Vue import
  const importStore = doc.find('import#store')[0];
  const importRouter = doc.find('import#router')[0];

  if (importStore) importStore.remove();
  if (importRouter) importRouter.remove();

  // Convert export to arrow function
  const vue = doc.find('new#Vue')[0];

  if (vue && vue.parentType('ExpressionStatement')) {
    vue
      .parentType('ExpressionStatement')
      .replace(
        `export function createApp({ router, store }) { return ${Recast.print(
          vue.node,
        )}; }`,
      );
  }

  return RQuery.print(doc);
};
