const request = require('request');

const baseURL = 'http://localhost:8080';

const doRequest = async (url, options) => {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        ...options,
      },
      (error, response, body) => {
        resolve({
          error,
          response,
          body,
        });
      },
    );
  });
};

const readSSRData = async () => {
  const scriptContent = await page.$eval(
    'script[data-vue-ssr-data]',
    el => el.textContent,
  );
  return JSON.parse(scriptContent.replace(/^window\.__DATA__=/, ''));
};

const isSPA = async () => {
  return (await page.$('script[data-vue-spa]')) !== null;
};

const isMounted = async () => {
  return page.waitForFunction(
    'document.querySelector("#mounted") && document.querySelector("#mounted").textContent === "true";',
  );
};

const gotoClick = async url => {
  const link = await page.$(`a[href="${url}"]`);
  await link.click();
  await page.waitForNavigation();
};

const checkText = async (selector, value) => {
  expect(await page.$eval(selector, el => el.textContent)).toBe(value);
};

module.exports = {
  baseURL,
  doRequest,
  readSSRData,
  isSPA,
  isMounted,
  gotoClick,
  checkText,
};
