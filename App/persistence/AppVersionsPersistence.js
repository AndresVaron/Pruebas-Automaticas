const MongoConnection = require('../utils/MongoConnection');
const MongoFunctions = require('../utils/MongoFunctions');
const collection = 'webappversions';

const fetchWebAppVersion = async (id) => {
    const dbconn = MongoConnection.getInstance();
    return await dbconn
        .collection(collection)
        .findOne({ _id: MongoFunctions.convertObjectId(id) });
};

module.exports = { fetchWebAppVersion };
