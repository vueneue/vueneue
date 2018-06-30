export default cy => {
  return cy.get('script[data-vue-ssr-data]').then(script => {
    return JSON.parse(script.text().replace(/^window\.__DATA__=/, ''));
  });
};
