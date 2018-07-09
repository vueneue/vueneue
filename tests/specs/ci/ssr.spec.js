const { readSSRData, isMounted, checkText, baseURL } = require('../utils');

describe('SSR features', () => {
  beforeAll(async () => {
    await page.goto(baseURL);
  });

  it('Call and inject onHttpRequest() data', async () => {
    const { state } = await readSSRData();
    expect(state.httpRequest).toBe('onHttpRequest');
  });

  it('Display onHttpRequest data correctly', async () => {
    await isMounted();
    await checkText('#value', 'onHttpRequest');
  });

  it('Inject error on onHttpRequest action', async () => {
    await page.goto(`${baseURL}/on-http-request-error`);
    const { state } = await readSSRData();
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('Display error on onHttpRequest action', async () => {
    await checkText('h1', 'Error 500');
  });

  it('Call asyncData() and inject to component', async () => {
    await page.goto(`${baseURL}/async-data`);
    const { components } = await readSSRData();
    expect(components[0]['value']).toBe('asyncData');
  });

  it('Display asyncData() data correctly', async () => {
    await isMounted();
    await checkText('#value', 'asyncData');
  });

  it('Call asyncData() and inject to store', async () => {
    await page.goto(`${baseURL}/async-data-store`);
    const { state } = await readSSRData();
    expect(state.value).toBe('asyncDataStore');
  });

  it('Display asyncData() store data correctly', async () => {
    await isMounted();
    await checkText('#value', 'asyncDataStore');
  });

  it('Error in asyncData() inject data to errorHandler', async () => {
    await page.goto(`${baseURL}/async-data-error`);
    const { state } = await readSSRData();
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('Display error page with statusCode', async () => {
    await checkText('h1', 'Error 500');
  });

  it('Redirect function', async () => {
    await page.goto(`${baseURL}/redirect`);
    await checkText('h1', 'Home');
  });

  it('404 error inject data to store', async () => {
    await page.goto(`${baseURL}/not-found`);
    const { state } = await readSSRData();
    expect(state.errorHandler.statusCode).toBe(404);
  });

  it('Display error page with statusCode 404', async () => {
    await checkText('h1', 'Error 404');
  });

  it('Call global middlewares', async () => {
    await page.goto(`${baseURL}/global-middleware`);
    const { state } = await readSSRData();
    expect(state.middleware).toBe('globalMiddleware');
  });

  it('Display global middlewares data correctly', async () => {
    await isMounted();
    await checkText('#value', 'globalMiddleware');
  });

  it('Call route middlewares', async () => {
    await page.goto(`${baseURL}/route-middleware`);
    const { state } = await readSSRData();
    expect(state.middleware).toBe('routeMiddleware');
  });

  it('Display route middlewares data correctly', async () => {
    await isMounted();
    await checkText('#value', 'routeMiddleware');
  });

  it('Middleware can redirect', async () => {
    await page.goto(`${baseURL}/middleware-redirect`);
    await checkText('h1', 'Home');
  });

  it('Middleware error', async () => {
    await page.goto(`${baseURL}/middleware-error`);
    const { state } = await readSSRData();
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('Middleware error with helper', async () => {
    await page.goto(`${baseURL}/middleware-error-func`);
    const { state } = await readSSRData();
    expect(state.errorHandler.statusCode).toBe(403);
  });

  it('Nested routes asyncData()', async () => {
    await page.goto(`${baseURL}/nested`);
    const { components } = await readSSRData();
    expect(components[0]['value']).toBe('parent');
    expect(components[1]['value']).toBe('child');
  });

  it('Nested routes with correct data displayed', async () => {
    await isMounted();
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('Nested routes middlewares', async () => {
    const { state } = await readSSRData();
    expect(state.parent).toBe('parent');
    expect(state.middleware).toBe('child');
  });

  it('Nested routes with correct data displayed from middlewares', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });
});
