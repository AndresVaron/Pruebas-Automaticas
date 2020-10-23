const fs = require('fs');

const deleteDirectory = (directory) => {
    try {
        fs.rmdirSync(directory, { recursive: true });
        console.log('Directory removed:' + directory);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { deleteDirectory };