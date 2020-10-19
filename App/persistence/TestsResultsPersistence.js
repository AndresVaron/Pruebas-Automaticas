const MongoConnection = require('../utils/MongoConnection');
const { convertObjectId } = require('../utils/MongoFunctions');
const collection = 'testsresults';

const insertTestResult = async (newElement) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).insertOne(newElement);
};

const updateTestResult = async (_id, updateTestResultData) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).updateOne({ _id }, updateTestResultData);
};

const findTestResultById = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).findOne({ _id: convertObjectId(id) });
};

const findTestResults = async (query) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn.collection(collection).find(query).toArray();
};

module.exports = { insertTestResult, updateTestResult, findTestResultById, findTestResults };