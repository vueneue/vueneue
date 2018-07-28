const request = require('request');
const cheerio = require('cheerio');

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

const gotoPageSSR = async url => {
  const response = await page.goto(url);
  const responseBody = await response.text();

  const $ = cheerio.load(responseBody);

  const scriptContent = $('script[data-vue-ssr-data]')
    .html()
    .replace(/^window\.__DATA__=/, '');

  $.DATA = JSON.parse(scriptContent);

  return $;
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
  await wait(50);
};

const checkText = async (selector, value) => {
  expect(await page.$eval(selector, el => el.textContent)).toBe(value);
};

const wait = time => new Promise(resolve => setTimeout(resolve, time));

module.exports = {
  gotoPageSSR,
  baseURL,
  doRequest,
  isSPA,
  isMounted,
  gotoClick,
  checkText,
  wait,
};
