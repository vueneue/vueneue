const { doRequest, baseURL } = require('../utils');

describe('HTTP status codes', () => {
  it('200 on home', async () => {
    const { response } = await doRequest(`${baseURL}/`);
    expect(response.statusCode).toBe(200);
  });

  it('404 on not found', async () => {
    const { response } = await doRequest(`${baseURL}/not-found`);
    expect(response.statusCode).toBe(404);
  });

  it('500 on onHttpRequest error', async () => {
    const { response } = await doRequest(`${baseURL}/on-http-request-error`);
    expect(response.statusCode).toBe(500);
  });

  it('500 on asyncData error', async () => {
    const { response } = await doRequest(`${baseURL}/async-data-error`);
    expect(response.statusCode).toBe(500);
  });

  it('301 on redirect function', async () => {
    const { response } = await doRequest(`${baseURL}/redirect`, {
      followRedirect: false,
    });
    expect(response.statusCode).toBe(301);
  });

  it('500 on middleware error', async () => {
    const { response } = await doRequest(`${baseURL}/middleware-error`);
    expect(response.statusCode).toBe(500);
  });

  it('403 on middleware error with helper', async () => {
    const { response } = await doRequest(`${baseURL}/middleware-error-func`);
    expect(response.statusCode).toBe(403);
  });
});
