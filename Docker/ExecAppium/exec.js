const main = require("./script.js");

const exec = async () => {
  if (main) {
    await main({
      port: 4723,
      hostname: process.env.HOST,
      path: "/wd/hub",
      capabilities: {
        platformName: "Android",
        platformVersion: "11",
        deviceName: process.env.DEVICE,
        app: "/APK/app.apk",
        automationName: "UiAutomator2",
      },
    });
  }
};
exec();
