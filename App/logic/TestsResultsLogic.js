const {
    findTestResults
} = require('../persistence/TestsResultsPersistence');
const {
    convertObjectId,
    convertListOfObjectId,
} = require('../utils/MongoFunctions');

const getTestResults = async (id, query = {}) => {
    try {
        const tests = await findTestResults({ aut: convertObjectId(id), ...query });
        return tests;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getTestResults };