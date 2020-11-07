const wdio = require("webdriverio");
const path = require('path');
const assert = require("assert").strict;
let client;
let picture = 0;
const tests = { start: null, end: null, results: [], success: 0, total: 0 };
let maxSubreddits = 0;
let currentPackageName = '';

const main = async (app, deviceName, platformVersion = '8.0.0') => {
    try {
        currentPackageName = app;
        const opts = {
            port: 4723,
            path: "/wd/hub",
            capabilities: {
                platformName: 'Android',
                platformVersion,
                deviceName,
                app,
                automationName: 'UiAutomator2'
            },
        };
        tests.start = new Date().getTime();
        picture = 0;
        opts.capabilities.app = path.join(__dirname, `${currentPackageName}.apk`);
        client = await wdio.remote(opts);
        await takeScreenshot();
        tests.end = new Date().getTime();
        await client.deleteSession();
        printTestsResults();
    } catch (error) {
        console.log(error);
        tests.end = new Date().getTime();
        printTestsResults();
    }
}

const printTestsResults = () => {
    console.log('-------------------------------------------------------------------------');
    console.log(currentPackageName + ' tests results:');
    console.log('Total time: ', tests.end - tests.start);
    console.log(`Success rate: ${tests.success} of ${tests.total} `);
    tests.results.forEach(test => {
        console.log(test);
    });
};


const takeScreenshot = async () => {
    await client.saveScreenshot(path.join(__dirname, `/screenshots/${currentPackageName}-${picture}.png`));
    picture++;
};

module.exports = main;