const PruebasPersistence = require('../persistence/PruebasPersistence');

/*
Pide al Persistence la lista de pruebas
*/
module.exports.fetchPruebas = async () => {
    try {
        return await PruebasPersistence.fetchPruebas();
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err,
            errCode: 500,
        };
        throw errJson;
    }
};
