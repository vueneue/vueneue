const { isMounted, checkText, baseURL, gotoPageSSR } = require('../utils');

let $;

describe('Server rendering', () => {
  beforeAll(async () => {
    $ = await gotoPageSSR(baseURL);
  });

  it('onHttpRequest: state injected to __DATA__', async () => {
    const { state } = $.DATA;
    expect(state.httpRequest).toBe('onHttpRequest');
  });

  it('onHttpRequest: state rendered on server side', async () => {
    expect($('#value').text()).toBe('onHttpRequest');
  });

  it('onHttpRequest: state displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'onHttpRequest');
  });

  it('onHttpRequest: error injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/on-http-request-error`);
    const { state } = $.DATA;
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('onHttpRequest: error rendered on server side', async () => {
    expect($('h1').text()).toBe('Error 500');
  });

  it('onHttpRequest: error displayed on client side', async () => {
    await checkText('h1', 'Error 500');
  });

  it('asyncData: data injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/async-data`);
    const { components } = $.DATA;
    expect(components[0]['value']).toBe('asyncData');
  });

  it('asyncData: data rendered on server side', async () => {
    expect($('#value').text()).toBe('asyncData');
  });

  it('asyncData: data displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'asyncData');
  });

  it('asyncData: state injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/async-data-store`);
    const { state } = $.DATA;
    expect(state.value).toBe('asyncDataStore');
  });

  it('asyncData: data rendered on server side', async () => {
    expect($('#value').text()).toBe('asyncDataStore');
  });

  it('asyncData: state displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'asyncDataStore');
  });

  it('asyncData: error injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/async-data-error`);
    const { state } = $.DATA;
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('asyncData: error rendered on server side', async () => {
    expect($('h1').text()).toBe('Error 500');
  });

  it('asyncData: error displayed on client side', async () => {
    await checkText('h1', 'Error 500');
  });

  it('redirect: called correctly', async () => {
    $ = await gotoPageSSR(`${baseURL}/redirect`);
    await checkText('h1', 'Home');
  });

  it('redirect: working in navigation guards', async () => {
    $ = await gotoPageSSR(`${baseURL}/redirect-nav-guard`);
    await checkText('h1', 'Home');
  });

  it('router: 404 error injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/not-found`);
    const { state } = $.DATA;
    expect(state.errorHandler.statusCode).toBe(404);
  });

  it('router: 404 error rendered on server side', async () => {
    expect($('h1').text()).toBe('Error 404');
  });

  it('router: 404 error displayed on client side', async () => {
    await checkText('h1', 'Error 404');
  });

  it('middlewares: global injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/global-middleware`);
    const { state } = $.DATA;
    expect(state.middleware).toBe('globalMiddleware');
  });

  it('middlewares: global rendered on server side', async () => {
    expect($('#value').text()).toBe('globalMiddleware');
  });

  it('middlewares: global displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'globalMiddleware');
  });

  it('middlewares: route injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/route-middleware`);
    const { state } = $.DATA;
    expect(state.middleware).toBe('routeMiddleware');
  });

  it('middlewares: route rendered on server side', async () => {
    expect($('#value').text()).toBe('routeMiddleware');
  });

  it('middlewares: route displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'routeMiddleware');
  });

  it('middlewares: redirect is called correctly', async () => {
    $ = await gotoPageSSR(`${baseURL}/middleware-redirect`);
    await checkText('h1', 'Home');
  });

  it('middlewares: error injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/middleware-error`);
    const { state } = $.DATA;
    expect(state.errorHandler.statusCode).toBe(500);
  });

  it('middlewares: error helper function injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/middleware-error-func`);
    const { state } = $.DATA;
    expect(state.errorHandler.statusCode).toBe(403);
  });

  it('asyncData: nested route injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/nested`);
    const { components } = $.DATA;
    expect(components[0]['value']).toBe('parent');
    expect(components[1]['value']).toBe('child');
  });

  it('middlewares: global rendered on server side', async () => {
    expect($('#parent-value').text()).toBe('parent');
    expect($('#value').text()).toBe('child');
  });

  it('asyncData: nested route displayed on client side', async () => {
    await isMounted();
    await checkText('#parent-value', 'parent');
    await checkText('#value', 'child');
  });

  it('middlewares: nested route injected to __DATA__', async () => {
    const { state } = $.DATA;
    expect(state.parent).toBe('parent');
    expect(state.middleware).toBe('child');
  });

  it('middlewares: global rendered on server side', async () => {
    expect($('#parent').text()).toBe('parent');
    expect($('#middleware').text()).toBe('child');
  });

  it('middlewares: nested route displayed to client side', async () => {
    await checkText('#parent', 'parent');
    await checkText('#middleware', 'child');
  });

  it('plugin: state injected to __DATA__', async () => {
    $ = await gotoPageSSR(`${baseURL}/plugin`);
    const { state } = $.DATA;
    expect(state.plugin).toBe('plugin');
  });

  it('plugin: state rendered on server side', async () => {
    expect($('#value').text()).toBe('plugin');
  });

  it('plugin: state displayed on client side', async () => {
    await isMounted();
    await checkText('#value', 'plugin');
  });
});
