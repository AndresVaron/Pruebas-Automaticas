const MongoConnection = require('../utils/MongoConnection');
const collection = 'versions';

const insertVersion = async (newVersion) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).insertOne(newVersion);
};

const findVersions = async (query) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).find(query).toArray();
};

module.exports = { insertVersion, findVersions };