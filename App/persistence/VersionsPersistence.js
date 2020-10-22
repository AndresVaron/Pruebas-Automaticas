const MongoConnection = require('../utils/MongoConnection');
const MongoFunctions = require('../utils/MongoFunctions');
const collection = 'versions';

const insertVersion = async (newVersion) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).insertOne(newVersion);
};

const findVersions = async (query) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).find(query).toArray();
};

const fetchVersion = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection(collection)
        .findOne({ _id: MongoFunctions.convertObjectId(id) });
};

const deleteTestVersions = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).deleteMany({
        test: MongoFunctions.convertObjectId(id),
    });
};

module.exports = {
    insertVersion,
    findVersions,
    fetchVersion,
    deleteTestVersions,
};
