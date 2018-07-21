const { readSSRData, checkText, baseURL, isMounted } = require('../utils');

describe('SPA routes', () => {
  it('Call and inject onHttpRequest() data', async () => {
    await page.goto(baseURL + '/spa');

    await isMounted();
    await checkText('#value', 'onHttpRequest');
  });

  it('Inject error on onHttpRequest action', async () => {
    await page.goto(`${baseURL}/spa/on-http-request-error`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await checkText('h1', 'Error 500');
  });

  it('Display asyncData() data correctly', async () => {
    await page.goto(`${baseURL}/spa/async-data`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await isMounted();
    await checkText('#value', 'asyncData');
  });

  it('Call asyncData() and inject to store', async () => {
    await page.goto(`${baseURL}/spa/async-data-store`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await isMounted();
    await checkText('#value', 'asyncDataStore');
  });

  it('Error in asyncData() inject data to errorHandler', async () => {
    await page.goto(`${baseURL}/spa/async-data-error`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await checkText('h1', 'Error 500');
  });

  it('Redirect function', async () => {
    await page.goto(`${baseURL}/spa/redirect`);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('404 error inject data to store', async () => {
    await page.goto(`${baseURL}/spa/not-found`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await checkText('h1', 'Error 404');
  });

  it('Call global middlewares', async () => {
    await page.goto(`${baseURL}/spa/global-middleware`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await isMounted();
    await checkText('#value', 'globalMiddleware');
  });

  it('Call route middlewares', async () => {
    await page.goto(`${baseURL}/spa/route-middleware`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);
    await isMounted();
    await checkText('#value', 'routeMiddleware');
  });

  it('Middleware can redirect', async () => {
    await page.goto(`${baseURL}/spa/middleware-redirect`);

    await isMounted();
    await checkText('h1', 'Home');
  });

  it('Middleware error', async () => {
    await page.goto(`${baseURL}/spa/middleware-error`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await checkText('h1', 'Error 500');
  });

  it('Middleware error with helper', async () => {
    await page.goto(`${baseURL}/spa/middleware-error-func`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await checkText('h1', 'Error 403');
  });

  it('Nested routes asyncData()', async () => {
    await page.goto(`${baseURL}/spa/nested`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await isMounted();
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('Nested routes middlewares', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });

  it('Call plugin init', async () => {
    await page.goto(`${baseURL}/spa/plugin`);
    const { spa } = await readSSRData();
    expect(spa).toBe(true);

    await isMounted();
    await checkText('#value', 'plugin');
  });
});
