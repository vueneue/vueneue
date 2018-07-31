const { gotoClick, checkText, baseURL, isMounted, wait } = require('../utils');

describe('Client side', () => {
  beforeAll(async () => {
    await page.goto(baseURL);
  });

  it('asyncData: data displayed', async () => {
    await gotoClick('/async-data');
    await checkText('#value', 'asyncData');
  });

  it('asyncData: state displayed', async () => {
    await gotoClick('/async-data-store');
    await checkText('#value', 'asyncDataStore');
  });

  it('asyncData: error displayed', async () => {
    await gotoClick('/async-data-error');
    await checkText('h1', 'Error 500');
  });

  it('router: redirect is called correctly', async () => {
    await gotoClick('/redirect');
    await checkText('h1', 'Home');
  });

  it('router: can display a 404 erorr', async () => {
    await gotoClick('/not-found');
    await checkText('h1', 'Error 404');
  });

  it('helper: error is displayed', async () => {
    await page.goto(baseURL + '/helpers');
    await isMounted();

    const button = await page.$('#error');
    await button.click();

    await wait(200);

    await checkText('h1', 'Error 403');
  });

  it('middlewares: global state is displayed', async () => {
    await gotoClick('/global-middleware');
    await checkText('#value', 'globalMiddleware');
  });

  it('middlewares: route state is displayed', async () => {
    await gotoClick('/route-middleware');
    await checkText('#value', 'routeMiddleware');
  });

  it('middlewares: redirect is called correctly', async () => {
    await gotoClick('/middleware-redirect');
    await checkText('h1', 'Home');
  });

  it('middlewares: error displayed', async () => {
    await gotoClick('/middleware-error');
    await checkText('h1', 'Error 500');
  });

  it('middlewares: error with helper is displayed', async () => {
    await gotoClick('/middleware-error-func');
    await checkText('h1', 'Error 403');
  });

  it('asyncData: nested route data is displayed', async () => {
    await gotoClick('/nested');
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('asyncData: nested route state is displayed', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });
});
