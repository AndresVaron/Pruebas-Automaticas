const {
    findTestResults,
    insertTestResult,
    updateTestResult,
} = require('../persistence/TestsResultsPersistence');
const { convertObjectId } = require('../utils/MongoFunctions');

const getTestResults = async (id, query = {}) => {
    try {
        const tests = await findTestResults({
            aut: convertObjectId(id),
            ...query,
        });
        return tests;
    } catch (error) {
        throw new Error(error.message);
    }
};

const postTestResults = async (results) => {
    try {
        if (
            results &&
            results.id_app &&
            results.id_app_version &&
            results.id_test &&
            results.id_version &&
            results.mobile !== undefined &&
            results.images &&
            results.numberOfImages
        ) {
            const tests = await findTestResults({
                appVersion: convertObjectId(results.id_app_version),
                testVersion: convertObjectId(results.id_version),
            });
            console.log(tests);
            if (tests && tests.length > 0) {
                await updateTestResult(convertObjectId(tests[0]._id), {
                    $set: {
                        images: results.images,
                        numberOfImages: results.numberOfImages,
                        creationDate: new Date(),
                    },
                });
            } else {
                await insertTestResult({
                    appVersion: convertObjectId(results.id_app_version),
                    aut: convertObjectId(results.id_app),
                    test: convertObjectId(results.id_test),
                    type: 'VRT',
                    mobile: results.mobile,
                    creationDate: new Date(),
                    testVersion: convertObjectId(results.id_version),
                    images: results.images,
                    numberOfImages: results.numberOfImages,
                });
            }
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};
module.exports = { getTestResults, postTestResults };
