const MongoConnection = require('../utils/MongoConnection');
const { convertObjectId } = require('../utils/MongoFunctions');
const collection = 'vrtresults';

const insertVRTResult = async (newElement) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).insertOne(newElement);
};

const updateVRTResult = async (_id, updateVRTResultData) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).updateOne({ _id }, updateVRTResultData);
};

const findVRTResultById = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).findOne({ _id: convertObjectId(id) });
};

const findVRTResults = async (query) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).find(query).toArray();
};

module.exports = { insertVRTResult, updateVRTResult, findVRTResultById, findVRTResults };