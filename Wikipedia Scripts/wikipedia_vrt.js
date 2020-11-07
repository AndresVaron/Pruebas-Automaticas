const wdio = require("webdriverio");
const path = require("path");
const assert = require("assert").strict;
let client;
let picture = 0;
const tests = { start: null, end: null, results: [], success: 0, total: 0 };

const main = async (opts) => {
  try {
    tests.start = new Date().getTime();
    picture = 0;
    client = await wdio.remote(opts);
    await takeScreenshot();
    await testSearch();
    tests.end = new Date().getTime();
    await client.deleteSession();
    printTestsResults();
  } catch (error) {
    console.log(error);
    tests.end = new Date().getTime();
    printTestsResults();
  }
};

const testSearch = async () => {
  const language = await client.$(
    'android=new UiSelector().resourceId("org.wikipedia:id/fragment_onboarding_skip_button")'
  );
  await language.click();
  await client.pause(1000);
  await takeScreenshot();
  bar = await client.$(
    'android=new UiSelector().resourceId("org.wikipedia:id/search_container")'
  );
  const input = await bar.$("android.widget.TextView");
  await input.click();
  await client.pause(1000);
  await input.sendKeys(["mercado"]);
  await client.pause(5000);
  await takeScreenshot();
};

const printTestsResults = () => {
  console.log(
    "-------------------------------------------------------------------------"
  );
  console.log(currentPackageName + " tests results:");
  console.log("Total time: ", tests.end - tests.start);
  console.log(`Success rate: ${tests.success} of ${tests.total} `);
  tests.results.forEach((test) => {
    console.log(test);
  });
};

const takeScreenshot = async () => {
  await client.saveScreenshot(
    path.join(__dirname, `/screenshots/${currentPackageName}-${picture}.png`)
  );
  picture++;
};

module.exports = main;
