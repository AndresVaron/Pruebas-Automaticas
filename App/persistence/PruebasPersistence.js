const MongoConnection = require('../utils/MongoConnection');

/*
Retorna la lista de todas las pruebas de la base de datos.
*/
module.exports.fetchPruebas = async () => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection('pruebas').find({}).toArray();
};
