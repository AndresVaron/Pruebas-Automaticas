const MongoConnection = require('../utils/MongoConnection');
const { convertObjectId } = require('../utils/MongoFunctions');
const collection = 'tests';

const insertTest = async (newElement) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).insertOne(newElement);
};

const updateTest = async (_id, updateTestData) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection(collection)
        .updateOne({ _id }, updateTestData);
};

const findTestById = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection(collection)
        .findOne({ _id: convertObjectId(id) });
};

const findTests = async (query) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).find(query).toArray();
};

/*
Elimina de la bd el test con el id dado.
*/
const deleteTest = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection(collection)
        .deleteOne({ _id: convertObjectId(id) });
};

module.exports = {
    insertTest,
    updateTest,
    findTestById,
    findTests,
    deleteTest,
};
