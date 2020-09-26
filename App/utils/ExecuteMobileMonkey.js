const { execSync, exec } = require("child_process");

const executeMobileMonkey = async (appVersionConfig, currentVersion, appVersion, currentApp) => {
    try {

        const installApp = () => {
            console.log('Installing app');
        };

        const running = checkRunningSimulators();
        if (!running) {
            const devicesOutput = execSync('emulator -list-avds', { encoding: 'utf-8' });
            const devices = devicesOutput.split('\n');
            if (devices.length > 0) {
                exec(`emulator -avd ${devices[0]} -netdelay none -netspeed full > emulator.log`, (error, stdout, stderr) => {
                    console.log('---------------------------------------------------------');
                    console.log(error);
                    console.log('---------------------------------------------------------');
                    console.log(stdout);
                    console.log('---------------------------------------------------------');
                    console.log(stderr);
                });
                setTimeout(() => {
                    if (running) {
                        installApp();
                    } else {
                        console.log('No emulator running');
                    }
                }, 15000);
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