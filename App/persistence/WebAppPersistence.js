const MongoConnection = require('../utils/MongoConnection');
const MongoFunctions = require('../utils/MongoFunctions');
/*
Retorna la lista completa de webapps
*/

module.exports.fetchWebApps = async () => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webapps')
        .aggregate([
            {
                $lookup: {
                    from: 'webappversions',
                    localField: '_id',
                    foreignField: 'id_app',
                    as: 'versiones',
                },
            },
        ])
        .toArray();
};

/*
Inserta la webapp pasada por parámetro. 
*/
module.exports.insertWebApp = async (webapp) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('webapps').insertOne(webapp);
};

module.exports.insertWebAppVersion = async (idApp, version) => {
    version.id_app = MongoFunctions.convertObjectId(idApp);
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('webappversions').insertOne(version);
};

/*
Retorna de la bd el dominio con el id dado.
*/
module.exports.fetchWebApp = async (id) => {
    const dbconn = MongoConnection.getInstance();

    return await dbconn
        .collection('webapps')
        .aggregate([
            {
                $match: {
                    _id: MongoFunctions.convertObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'webappversions',
                    localField: '_id',
                    foreignField: 'id_app',
                    as: 'versiones',
                },
            },
        ])
        .toArray();
};

/*
Actualiza el dominio con el id dado en la bd. 
*/
module.exports.updateDominio = async (id, update) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webapps')
        .updateOne(
            { _id: MongoFunctions.convertObjectId(id) },
            { $set: update }
        );
};

/*
Elimina de la bd la webapp con el id dado.
*/
module.exports.deleteWebApp = async (id) => {
    id = MongoFunctions.convertObjectId(id);
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('webapps').deleteOne({ _id: id });
};

/*
Retorna la lista completa de webapps
*/

module.exports.fetchWebAppVersionConfigs = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webappsconfigs')
        .aggregate([
            {
                $match: {
                    id_version: MongoFunctions.convertObjectId(id),
                },
            },
        ])
        .toArray();
};

/*
Retorna de la bd la pregunta con el id dado.
*/
module.exports.fetchWebAppPrueba = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection('webappspruebas')
        .findOne({ _id: MongoFunctions.convertObjectId(id) });
};

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
