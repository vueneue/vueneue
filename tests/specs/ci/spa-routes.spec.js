const { isSPA, checkText, baseURL, isMounted, wait } = require('../utils');

describe('SPA routes', () => {
  it('onHttpRequest: displayed', async () => {
    await page.goto(baseURL + '/spa');

    await isMounted();
    await checkText('#value', 'onHttpRequest');
  });

  it('onHttpRequest: error displayed', async () => {
    await page.goto(`${baseURL}/spa/on-http-request-error`);
    await wait(50);

    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('asyncData: data displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data`);
    await wait(50);

    await isSPA();
    await isMounted();
    await checkText('#value', 'asyncData');
  });

  it('asyncData: state displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data-store`);
    await wait(50);

    await isSPA();
    await isMounted();
    await checkText('#value', 'asyncDataStore');
  });

  it('asyncData: error displayed', async () => {
    await page.goto(`${baseURL}/spa/async-data-error`);
    await wait(50);

    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('redirect: called correctly', async () => {
    await page.goto(`${baseURL}/spa/redirect`);
    await wait(50);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('router: can display 404 error', async () => {
    await page.goto(`${baseURL}/spa/not-found`);
    await wait(50);

    await isSPA();
    await checkText('h1', 'Error 404');
  });

  it('middlewares: global state displayed', async () => {
    await page.goto(`${baseURL}/spa/global-middleware`);
    await wait(50);

    await isSPA();
    await isMounted();
    await checkText('#value', 'globalMiddleware');
  });

  it('middlewares: route state displayed', async () => {
    await page.goto(`${baseURL}/spa/route-middleware`);
    await wait(50);

    await isSPA();
    await isMounted();
    await checkText('#value', 'routeMiddleware');
  });

  it('middlewares: redirect', async () => {
    await page.goto(`${baseURL}/spa/middleware-redirect`);
    await wait(50);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('middlewares: error displayed', async () => {
    await page.goto(`${baseURL}/spa/middleware-error`);
    await wait(50);

    await isSPA();
    await checkText('h1', 'Error 500');
  });

  it('middlewares: error with helper displayed', async () => {
    await page.goto(`${baseURL}/spa/middleware-error-func`);
    await wait(50);

    await isSPA();
    await checkText('h1', 'Error 403');
  });

  it('asyncData: data on nested route displayed', async () => {
    await page.goto(`${baseURL}/spa/nested`);
    await wait(50);

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
    await wait(50);

    await isSPA();
    await isMounted();
    await checkText('#value', 'plugin');
  });
});
