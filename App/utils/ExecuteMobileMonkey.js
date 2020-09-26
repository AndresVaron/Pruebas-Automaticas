const { execSync, exec } = require("child_process");
const { downloadFile } = require('../logic/FilesUploadLogic');

const executeMobileMonkey = async (appVersionConfig, currentVersion, appVersion, currentApp) => {
    try {
        const fileKey = appVersion.url.split('s3.amazonaws.com/')[1];
        const packageName = currentApp.package;
        const directory = `../mobileApps/${currentApp._id}/versions/${appVersion._id}`;
        const installApp = () => {
            downloadFile(fileKey, directory, packageName + '.apk').then(data => {
                console.log(data);
                exec(`adb install ${directory}/${packageName}.apk`, (error, stdout, stderr) => {
                    if (error || stderr) {
                        console.log(error);
                        console.log(stderr);
                    } else {
                        const monkeyRun = `adb shell monkey -p ${packageName} -v ${currentVersion.events} > ${directory}/${new Date().getTime()}.log`;
                        console.log(monkeyRun);
                        exec(monkeyRun, (error, stdout, stderr) => {
                            console.log(error);
                            console.log(stderr);
                            console.log(stdout);
                        });
                    }
                });
            }).catch(err => {
                console.log(err);
            });
        };

        const running = checkRunningSimulators();
        if (!running) {
            const devicesOutput = execSync('emulator -list-avds', { encoding: 'utf-8' });
            const devices = devicesOutput.split('\n');
            if (devices.length > 0) {
                exec(`emulator -avd ${devices[0]} -netdelay none -netspeed full`, (error, stdout, stderr) => {
                    console.log('---------------------------------------------------------');
                    console.log(error);
                    console.log('---------------------------------------------------------');
                    console.log(stdout);
                    console.log('---------------------------------------------------------');
                    console.log(stderr);
                });
                setTimeout(() => {
                    if (checkRunningSimulators()) {
                        installApp();
                    } else {
                        console.log('No emulator running');
                    }
                }, 20000);
            } else {
                console.log('No available emulators');
            }
        } else {
            console.log('Already running');
            installApp();
        }
    } catch (err) {
        console.log(err);
    }
};

const checkRunningSimulators = () => {
    const runningEmulators = execSync('adb devices', { encoding: 'utf-8' });
    const devices = runningEmulators.split('\n');
    if (devices[1] !== '') {
        return true;
    }
    return false;
}

module.exports = executeMobileMonkey;