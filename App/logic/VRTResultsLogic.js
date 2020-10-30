const {
    findVRTResults,
    insertVRTResult,
} = require('../persistence/VRTResults');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const {
    convertObjectId,
    convertListOfObjectId,
} = require('../utils/MongoFunctions');
const compare = require('../utils/CompareImages');

const getVRTResults = async (id, query = {}) => {
    try {
        const tests = await findVRTResults({
            aut: convertObjectId(id),
            ...query,
        });
        return tests;
    } catch (error) {
        throw new Error(error.message);
    }
};

const postVRTResult = async (
    id,
    {
        test,
        testVersion,
        firstAppVersion,
        firstAppImages,
        secondAppVersion,
        secondAppImages,
    }
) => {
    let errJson = { errMsg: '', errCode: 500 };
    let err = false;
    if (
        !test ||
        !testVersion ||
        !firstAppVersion ||
        !firstAppImages ||
        !secondAppImages ||
        !secondAppVersion
    ) {
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
            makeComparations(
                aut,
                id,
                test,
                testVersion,
                firstAppVersion,
                firstAppImages,
                secondAppVersion,
                secondAppImages
            );
            setTimeout(() => {
                return 'La comparación está siendo procesada';
            }, 3000);
        }
    } catch (error) {
        console.log(error);
        errJson = { error: new Error(), errMsg: err.toString(), errCode: 500 };
        throw errJson;
    }
};

const makeComparations = async (
    aut,
    id,
    test,
    testVersion,
    firstAppVersion,
    firstAppImages,
    secondAppVersion,
    secondAppImages
) => {
    const comparation = await compare(
        id,
        aut[0].mobile ? 'mobile' : 'web',
        firstAppImages,
        secondAppImages,
        test,
        testVersion,
        firstAppVersion,
        secondAppVersion
    );
    if (comparation) {
        await insertVRTResult({
            comparationResults: comparation,
            creationDate: new Date(),
            aut: convertObjectId(id),
            test: convertObjectId(test),
            firstAppVersion: convertObjectId(firstAppVersion),
            secondAppVersion: convertObjectId(secondAppVersion),
        });
        console.log('VRT results stored');
    }
};

module.exports = { getVRTResults, postVRTResult };
