const {
    insertTest,
    updateTest,
    findTests,
    deleteTest,
} = require('../persistence/TestsPersistence');
const {
    insertVersion,
    findVersions,
    deleteTestVersions,
} = require('../persistence/VersionsPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const {
    convertObjectId,
    convertListOfObjectId,
} = require('../utils/MongoFunctions');

const postTest = async (
    id,
    { name, shortName, url, version, type, dispositivo }
) => {
    let errJson = { errMsg: '', errCode: 500 };
    let err = false;
    if (!name || !shortName || !version) {
        err = true;
        errJson.errMsg += 'Por favor verifica la información ingresada';
    }

    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    try {
        const aut = await WebAppPersistence.fetchWebApp(id);
        if (aut.length === 0) {
            errJson.errMsg = 'No existe un AUT con el id ingresado';
            throw errJson;
        } else {
            if (aut[0].mobile && !dispositivo) {
                errJson.errMsg = 'Por favor verifica la información ingresada';
                throw errJson;
            }
            const existingTests = await findTests({
                aut: convertObjectId(id),
                shortName: shortName.toUpperCase(),
            });
            if (existingTests.length > 0) {
                errJson.errMsg = 'Ya existen pruebas con el alias ingresado';
                throw errJson;
            } else {
                const newTest = {
                    name,
                    shortName: shortName.toUpperCase(),
                    creationDate: new Date(),
                    aut: aut[0]._id,
                    versions: [],
                    type: type,
                    mobile: aut[0].mobile,
                };
                if (newTest.mobile) {
                    newTest.dispositivo = dispositivo;
                }
                const createdTest = await insertTest(newTest);
                const newVersion = {
                    test: createdTest.ops[0]._id,
                    creationDate: new Date(),
                    version,
                    url: url || '',
                };
                if (type === 'MobileMonkey') {
                    newVersion['events'] = Number(version);
                }
                const createdVersion = await insertVersion(newVersion);
                await updateTest(createdTest.ops[0]._id, {
                    $set: { versions: [createdVersion.ops[0]._id] },
                });
                return createdTest.ops[0];
            }
        }
    } catch (error) {
        console.log(error);
        errJson = { error: new Error(), errMsg: err.toString(), errCode: 500 };
        throw errJson;
    }
};

const getTests = async (id, populate = true, query = {}) => {
    try {
        const tests = await findTests({ aut: convertObjectId(id), ...query });
        if (populate) {
            const versionsPromises = [];
            tests.forEach((test) => {
                const versions = convertListOfObjectId(test.versions);
                versionsPromises.push(findVersions({ _id: { $in: versions } }));
            });
            const versionsResults = await Promise.all(versionsPromises);
            versionsResults.forEach((versionResult, index) => {
                tests[index].versions = versionResult;
            });
        }
        return tests;
    } catch (error) {
        return { error: 'yep' };
    }
};

const deleteWebAppTests = async (id) => {
    try {
        const tests = await findTests({ aut: convertObjectId(id), ...{} });
        for (const tst of tests) {
            await deleteTestVersions(tst._id);
            await deleteTest(tst._id);
        }
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports = { postTest, getTests, deleteWebAppTests };
