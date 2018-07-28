const { isSPA, checkText, baseURL, isMounted, wait } = require('../utils');

describe('SPA routes', () => {
  it('onHttpRequest: displayed', async () => {
    await page.goto(baseURL + '/spa');

    await isMounted();
    await checkText('#value', 'onHttpRequest');
  });

  it('onHttpRequest: error displayed', async () => {
    await page.goto(`${baseURL}/spa/on-http-request-error`);
    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('asyncData: data displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data`);
    await isSPA();
    await isMounted();
    await checkText('#value', 'asyncData');
  });

  it('asyncData: state displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data-store`);
    await isSPA();
    await isMounted();
    await checkText('#value', 'asyncDataStore');
  });

  it('asyncData: error displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data-error`);
    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('redirect: called correctly', async () => {
    await page.goto(`${baseURL}/spa/redirect`);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('router: can display 404 error', async () => {
    await page.goto(`${baseURL}/spa/not-found`);
    await isSPA();
    await checkText('h1', 'Error 404');
  });

  it('middlewares: global state displayed', async () => {
    await page.goto(`${baseURL}/spa/global-middleware`);
    await isSPA();
    await isMounted();
    await checkText('#value', 'globalMiddleware');
  });

  it('middlewares: route state displayed', async () => {
    await page.goto(`${baseURL}/spa/route-middleware`);
    await isSPA();
    await isMounted();
    await checkText('#value', 'routeMiddleware');
  });

  it('middlewares: redirect', async () => {
    await page.goto(`${baseURL}/spa/middleware-redirect`);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('middlewares: error displayed', async () => {
    await page.goto(`${baseURL}/spa/middleware-error`);
    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('middlewares: error with helper displayed', async () => {
    await page.goto(`${baseURL}/spa/middleware-error-func`);
    await isSPA();
    await checkText('h1', 'Error 403');
  });

  it('asyncData: data on nested route displayed', async () => {
    await page.goto(`${baseURL}/spa/nested`);
    await isSPA();
    await isMounted();
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('middlewares: state on nested route displayed', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });

  it('plugin: state is displayed', async () => {
    await page.goto(`${baseURL}/spa/plugin`);
    await isSPA();
    await isMounted();
    await checkText('#value', 'plugin');
  });
});
