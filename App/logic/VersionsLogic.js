const { findTestById, updateTest } = require('../persistence/TestsPersistence');
const { insertVersion } = require('../persistence/VersionsPersistence');

const postVersion = async (autId, { url, version, type, events }) => {
    let errJson = { errMsg: '', errCode: 500, };
    let err = false;
    if (!events && !url && !version) {
        err = true;
        errJson.errMsg += 'Por favor verifica la información ingresada';
    }

    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    try {
        const test = await findTestById(autId);
        if (!test) {
            throw { errMsg: 'No existe una prueba con el id ingresado' };
        } else {
            const newVersion = { test: test._id, creationDate: new Date(), version, url };
            if (test.type === 'MobileMonkey') {
                newVersion.version = events;
                newVersion['events'] = Number(events);
            }
            const createdVersion = await insertVersion(newVersion);
            await updateTest(test._id, { $push: { versions: createdVersion.ops[0]._id } });
            return createdVersion.ops[0];
        }
    } catch (error) {
        console.log(error);
        errJson = { error: new Error(), errMsg: err.toString(), errCode: 500, };
        throw errJson;
    }
};

module.exports = { postVersion };
