const { downloadFile } = require('../logic/FilesUploadLogic');
const { execSync, exec } = require("child_process");
const { Logger } = require('mongodb');

const checkRunningSimulators = () => {
    const runningEmulators = execSync('adb devices', { encoding: 'utf-8' });
    const devices = runningEmulators.split('\n');
    if (devices[1] !== '') {
        return devices[1].split('\t')[0];
    }
    return false;
}

const uninstallApp = (packageName) => {
    try {
        execSync(`adb uninstall ${packageName}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const prepareMobileApp = async (appVersion, currentApp, directory, packageName) => {
    return new Promise((resolve, reject) => {
        const fileKey = appVersion.url.split('s3.amazonaws.com/')[1];
        downloadFile(fileKey, directory, packageName + '.apk').then(data => {
            console.log('Apk downloaded in: ' + directory + '/' + packageName);
            const running = checkRunningSimulators();
            if (!running) {
                const devicesOutput = execSync('emulator -list-avds', { encoding: 'utf-8' });
                const devices = devicesOutput.split('\n');
                if (devices.length > 0) {
                    const check = setTimeout(() => {
                        resolve(checkRunningSimulators());
                    }, 10000);
                    exec(`emulator -avd ${devices[0]} -netdelay none -netspeed full`, (error, stdout, stderr) => {
                        if (error) {
                            console.log(error);
                            clearTimeout(check);
                            return reject(null);
                        }
                    });
                } else {
                    console.log('No available emulators');
                    resolve(null);
                }
            } else {
                console.log('Already running');
                resolve(running);
            }
        }).catch(err => {
            console.log(err);
            resolve(null);
        });
    });
};

module.exports = {
    uninstallApp, prepareMobileApp
};