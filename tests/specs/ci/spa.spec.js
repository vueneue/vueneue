const { gotoClick, checkText, baseURL } = require('../utils');

describe('SSR features with SPA navigation', () => {
  beforeAll(async () => {
    await page.goto(baseURL);
  });

  it('asyncData() is resolved', async () => {
    await gotoClick('/async-data');
    await checkText('#value', 'asyncData');
  });

  it('asyncData() for store is resolved', async () => {
    await gotoClick('/async-data-store');
    await checkText('#value', 'asyncDataStore');
  });

  it('asyncData() can display error page', async () => {
    await gotoClick('/async-data-error');
    await checkText('h1', 'Error 500');
  });

  it('$redirect() is called correctly', async () => {
    await gotoClick('/redirect');
    await checkText('h1', 'Home');
  });

  it('$error() is called correctly', async () => {
    await gotoClick('/error');

    const button = await page.$('button');
    await button.click();

    await checkText('h1', 'Error 403');
  });

  it('404 not found page is displayed', async () => {
    await gotoClick('/not-found');
    await checkText('h1', 'Error 404');
  });

  it('Global middleware is called', async () => {
    await gotoClick('/global-middleware');
    await checkText('#value', 'globalMiddleware');
  });

  it('Route middleware is called', async () => {
    await gotoClick('/route-middleware');
    await checkText('#value', 'routeMiddleware');
  });

  it('Middleware can redirect', async () => {
    await gotoClick('/middleware-redirect');
    await checkText('h1', 'Home');
  });

  it('Middleware can have an error', async () => {
    await gotoClick('/middleware-error');
    await checkText('h1', 'Error 500');
  });

  it('Middleware can have an error with helper', async () => {
    await gotoClick('/middleware-error-func');
    await checkText('h1', 'Error 403');
  });

  it('Nested routes asyncData()', async () => {
    await gotoClick('/nested');
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('Nested routes middlewares', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });
});
