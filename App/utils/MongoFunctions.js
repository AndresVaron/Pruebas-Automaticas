const ObjectId = require('mongodb').ObjectID;

/*
Convierte un string en un id de mongo, lanza una excepción en caso de que el id no se pueda convertir
*/
module.exports.convertObjectId = (id) => {
    try {
        return ObjectId(id);
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: 'El id no cumple con el formato de un id de mongo',
            errCode: 400,
        };
        throw errJson;
    }
};
/*
Convierte una lista de strings en una lista de ids de mongo, lanza una excepción en caso de que algun id no se pueda convertir
*/
module.exports.convertListOfObjectId = (list) => {
    try {
        return list.map(function (id) {
            return ObjectId(id);
        });
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: 'El id no cumple con el formato de un id de mongo',
            errCode: 400,
        };
        throw errJson;
    }
};
