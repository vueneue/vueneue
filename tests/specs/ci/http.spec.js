const { doRequest } = require('../utils');
const baseUrl = 'http://localhost:8080';

describe('HTTP status codes', () => {
  it('200 on home', async () => {
    const { response } = await doRequest(`${baseUrl}/`);
    expect(response.statusCode).toBe(200);
  });

  it('404 on not found', async () => {
    const { response } = await doRequest(`${baseUrl}/not-found`);
    expect(response.statusCode).toBe(404);
  });

  it('500 on onHttpRequest error', async () => {
    const { response } = await doRequest(`${baseUrl}/on-http-request-error`);
    expect(response.statusCode).toBe(500);
  });

  it('500 on asyncData error', async () => {
    const { response } = await doRequest(`${baseUrl}/async-data-error`);
    expect(response.statusCode).toBe(500);
  });

  it('302 on redirect function', async () => {
    const { response } = await doRequest(`${baseUrl}/redirect`, {
      followRedirect: false,
    });
    expect(response.statusCode).toBe(302);
  });

  it('500 on middleware error', async () => {
    const { response } = await doRequest(`${baseUrl}/middleware-error`);
    expect(response.statusCode).toBe(500);
  });

  it('403 on middleware error with helper', async () => {
    const { response } = await doRequest(`${baseUrl}/middleware-error-func`);
    expect(response.statusCode).toBe(403);
  });
});
