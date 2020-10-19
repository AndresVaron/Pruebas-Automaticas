const { exec } = require("child_process");

const executeMobileMonkey = async (currentVersion, directory, packageName) => {
    try {
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
    } catch (err) {
        console.log(err);
    }
};

module.exports = executeMobileMonkey;