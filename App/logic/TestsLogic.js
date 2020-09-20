const { insertTest, updateTest, findTests } = require('../persistence/TestsPersistence');
const { insertVersion, findVersions } = require('../persistence/VersionsPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const { convertObjectId, convertListOfObjectId } = require('../utils/MongoFunctions');

const postTest = async (id, { name, shortName, url, version, type }) => {
    let errJson = { errMsg: '', errCode: 500, };
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
            throw { errMsg: 'No existe un AUT con el id ingresado' };
        } else {
            const existingTests = await findTests({ aut: convertObjectId(id), shortName: shortName.toUpperCase() });
            if (existingTests.length > 0) {
                throw { errMsg: 'Ya existen pruebas con el alias ingresado' };
            } else {
                const newTest = { name, shortName: shortName.toUpperCase(), creationDate: new Date(), aut: aut[0]._id, versions: [], type: type || 'Cypress' };
                const createdTest = await insertTest(newTest);
                const createdVersion = await insertVersion({ test: createdTest.ops[0]._id, creationDate: new Date(), version, url: url || '' });
                await updateTest(createdTest.ops[0]._id, { $set: { versions: [createdVersion.ops[0]._id] } });
                return createdTest.ops[0];
            }
        }
    } catch (error) {
        errJson = { error: new Error(), errMsg: err.toString(), errCode: 500, };
        throw errJson;
    }
};

const getTests = async (id, populate = true) => {
    try {
        const tests = await findTests({ aut: convertObjectId(id) });
        if (populate) {
            const versionsPromises = [];
            tests.forEach(test => {
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

module.exports = { postTest, getTests };
