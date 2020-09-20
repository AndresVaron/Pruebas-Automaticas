const util = require('util');
const exec = util.promisify(require('child_process').exec);

/*
Método encargado de obtener todas las apps web
*/
module.exports.execMobileAppConfig = async (id_config) => {
    console.log(id_config);
    try {
        //Se ejecuta el comando en consola
        const { stdout, stderr } = await exec('echo Hola Mundo');
        console.log('stdout:', stdout);
        if (stderr !== '') {
            console.log('stderr:', stderr);
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
