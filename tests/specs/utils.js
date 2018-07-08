const doRequest = async () => {};

const readSSRData = async () => {
  const scriptContent = await page.$eval(
    'script[data-vue-ssr-data]',
    el => el.textContent,
  );
  return JSON.parse(scriptContent.replace(/^window\.__DATA__=/, ''));
};

const isMounted = async () => {
  return page.waitForFunction(
    'document.querySelector("#mounted").textContent === "true";',
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
  doRequest,
  readSSRData,
  isMounted,
  gotoClick,
  checkText,
};
