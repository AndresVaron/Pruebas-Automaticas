const MongoConnection = require('../utils/MongoConnection');
const MongoFunctions = require('../utils/MongoFunctions');
/*

/*
Inserta una configuracion de webapp. 
*/
module.exports.insertWebAppConfig = async (config) => {
    config.id_version = MongoFunctions.convertObjectId(config.id_version);
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('webappsconfigs').insertOne(config);
};

/*
Retorna de la bd la pregunta con el id dado.
*/
module.exports.fetchWebAppVersionConfig = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webappsconfigs')
        .findOne({ _id: MongoFunctions.convertObjectId(id) });
};

module.exports.updateWebAppConfig = async (id, update) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webappsconfigs')
        .updateOne(
            { _id: MongoFunctions.convertObjectId(id) },
            { $set: update }
        );
};

/*
Elimina de la bd la webapp config con el id dado.
*/
module.exports.deleteWebAppConfig = async (id) => {
    id = MongoFunctions.convertObjectId(id);
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('webappsconfigs').deleteOne({ _id: id });
};
