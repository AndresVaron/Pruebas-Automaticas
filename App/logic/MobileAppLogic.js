const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const VersionsPersistence = require('../persistence/VersionsPersistence');

/*
Método encargado de obtener todas las apps web
*/
module.exports.execMobileAppConfig = async (id) => {
    try {
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(id);
        console.log(response);
        if (response === null) {
            const errJson = {
                errMsg: 'No existe una configuracion con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        } else {
            //Se ejecuta el comando en consola
            const currentVersion = await VersionsPersistence.fetchVersion(response.pruebas[0][0]);
            const { stdout, stderr } = await exec('sh ~/Documents/Monkey_Wiki.sh');
            console.log('stdout:', stdout);
            if (stderr !== '') {
                console.log('stderr:', stderr);
            }
        }

    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};
