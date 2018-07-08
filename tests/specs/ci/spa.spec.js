const gotoClick = async url => {
  const link = await page.$(`a[href="${url}"]`);
  await link.click();
  await page.waitForNavigation();
};

describe('SSR features in SPA mode', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080');
  });

  it('asyncData() is resolved', async () => {
    await gotoClick('/async-data');
    expect(await page.$eval('#value', el => el.textContent)).toBe('asyncData');
  });

  it('asyncData() for store is resolved', async () => {
    await gotoClick('/async-data-store');
    expect(await page.$eval('#value', el => el.textContent)).toBe(
      'asyncDataStore',
    );
  });

  it('asyncData() can display error page', async () => {
    await gotoClick('/async-data-error');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Error 500');
  });

  it('$redirect() is called correctly', async () => {
    await gotoClick('/redirect');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Home');
  });

  it('$error() is called correctly', async () => {
    await gotoClick('/error');

    const button = await page.$('button');
    await button.click();

    expect(await page.$eval('h1', el => el.textContent)).toBe('Error 403');
  });

  it('404 not found page is displayed', async () => {
    await gotoClick('/not-found');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Error 404');
  });

  it('Global middleware is called', async () => {
    await gotoClick('/global-middleware');
    expect(await page.$eval('#value', el => el.textContent)).toBe(
      'globalMiddleware',
    );
  });

  it('Route middleware is called', async () => {
    await gotoClick('/route-middleware');
    expect(await page.$eval('#value', el => el.textContent)).toBe(
      'routeMiddleware',
    );
  });

  it('Middleware can redirect', async () => {
    await gotoClick('/middleware-redirect');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Home');
  });

  it('Middleware can have an error', async () => {
    await gotoClick('/middleware-error');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Error 500');
  });

  it('Middleware can have an error with helper', async () => {
    await gotoClick('/middleware-error-func');
    expect(await page.$eval('h1', el => el.textContent)).toBe('Error 403');
  });

  it('Nested routes asyncData()', async () => {
    await gotoClick('/nested');
    expect(await page.$eval('#parent-value', el => el.textContent)).toBe(
      'parent',
    );
    expect(await page.$eval('#value', el => el.textContent)).toBe('child');
  });

  it('Nested routes middlewares', async () => {
    expect(await page.$eval('#parent', el => el.textContent)).toBe('parent');
    expect(await page.$eval('#middleware', el => el.textContent)).toBe('child');
  });
});
