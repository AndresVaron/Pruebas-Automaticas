const { downloadFile, uploadFile } = require('../logic/FilesUploadLogic');
const {
    findTestResults,
    insertTestResult,
    updateTestResult,
} = require('../persistence/TestsResultsPersistence');
const { mkdirSync, readdirSync, readFileSync } = require('fs');

const executeVRT = (
    test,
    directory,
    packageName,
    deviceName,
    appVersion,
    mobile = true
) => {
    return new Promise(async (resolve, reject) => {
        const fileKey = test.url.split('s3.amazonaws.com/')[1];
        try {
            await downloadFile(fileKey, directory, packageName + '.js');
            if (mobile) {
                mkdirSync(directory + '/screenshots');
                const main = require('../' + directory + '/' + packageName);
                if (main) {
                    await main(packageName, deviceName);
                }
                directory = directory + '/screenshots';
            } else {
                //
            }
            const files = readdirSync(directory);
            const fileToUploadName = `${mobile ? 'mobile' : 'web'}/vrt/${
                appVersion.id_app
            }/version/${appVersion._id}/test/${test.test}/version/${test._id}/`;
            const uploaded = [];
            for (let index = 0; index < files.length; index++) {
                const fileName = files[index];
                try {
                    const file = readFileSync(`${directory}/${fileName}`);
                    const uploadedUrl = await uploadFile(
                        file,
                        fileToUploadName + fileName
                    );
                    uploaded.push(uploadedUrl);
                } catch (error) {
                    console.log(error);
                }
            }
            const tests = await findTestResults({
                appVersion: appVersion._id,
                testVersion: test._id,
            });
            if (tests && tests.length > 0) {
                await updateTestResult(tests[0]._id, {
                    $set: {
                        images: uploaded,
                        numberOfImages: uploaded.length,
                        creationDate: new Date(),
                    },
                });
            } else {
                await insertTestResult({
                    appVersion: appVersion._id,
                    aut: appVersion.id_app,
                    test: test.test,
                    type: 'VRT',
                    mobile,
                    creationDate: new Date(),
                    testVersion: test._id,
                    images: uploaded,
                    numberOfImages: uploaded.length,
                });
            }
            resolve(true);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};

module.exports = executeVRT;
