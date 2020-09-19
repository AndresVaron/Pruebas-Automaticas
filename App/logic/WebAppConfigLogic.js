const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const MongoFunctions = require('../utils/MongoFunctions');

module.exports.postWebAppVersionConfig = async (id_version) => {
    //Se intenta crear la webapp
    try {
        const finalWebAppConfig = {
            nombre: 'Configuración',
            pruebas: [],
            id_version: id_version,
        };
        const today = new Date(Date.now());
        finalWebAppConfig.fechaCreacion = new Date(
            Date.now() - today.getTimezoneOffset() * 60 * 1000
        );

        //Crear un job de Jenkins

        const response = await WebAppConfigPersistence.insertWebAppConfig(
            finalWebAppConfig
        );
        return response.ops[0];
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports.getWebAppVersionConfig = async (
    id_app,
    id_version,
    id_config
) => {
    try {
        const response = await WebAppConfigPersistence.fetchWebAppVersionConfig(
            id_config
        );
        if (response === null) {
            const errJson = {
                errMsg: 'No existe una configuracion con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        } else {
            if (response.id_version.toString() !== id_version) {
                const errJson = {
                    errMsg: 'Esta configuracion no pertenece a esta version',
                    errCode: 400,
                };
                errJson.error = new Error();
                throw errJson;
            }
            for (let j = 0; j < response.pruebas.length; j++) {
                for (let i = 0; i < response.pruebas[j].length; i++) {
                    response.pruebas[j][
                        i
                    ] = await WebAppPersistence.fetchWebAppPrueba(
                        response.pruebas[j][i]
                    );
                }
            }
            return response;
        }
    } catch (err) {
        if (err.errCode) {
            throw err;
        }
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

module.exports.updateWebAppVersionConfig = async (id, config) => {
    const errJson = {
        errMsg: '',
        errCode: 500,
    };
    let err = false;
    if (
        config.nombre === undefined ||
        typeof config.nombre !== 'string' ||
        config.nombre === ''
    ) {
        //Append mensaje de error correspondiente
        err = true;
        errJson.errMsg +=
            'Nombre de la configuración incorrecto o undefined \n';
    }

    // En caso de error se lanza una respuesta de tipo 400 con los errores
    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    //Hacer el put.
    let updateResponse;
    try {
        let valid = true;
        if (config.pruebas.length > 0) {
            for (let i = 0; i < config.pruebas.length; i++) {
                for (let j = 0; j < config.pruebas[i].length; j++) {
                    const prueba = config.pruebas[i][j];
                    if (
                        (await WebAppPersistence.fetchWebAppPrueba(prueba)) ===
                        null
                    ) {
                        valid = false;
                    } else {
                        config.pruebas[i][j] = MongoFunctions.convertObjectId(
                            prueba
                        );
                    }
                }
            }
            if (!valid) {
                errJson.errMsg += 'Las pruebas no son validas.';
                errJson.errCode = 400;
                errJson.error = new Error();
                throw errJson;
            }
        }

        updateResponse = await WebAppConfigPersistence.updateWebAppConfig(
            id,
            config
        );
    } catch (err) {
        if (err.errCode) {
            throw err;
        }
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
    if (updateResponse.result.n !== 1) {
        errJson.errMsg += 'Esta configuración no existe';
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    return 'Se actualizó la configuracion';
};

/* 
Método encargado de borrar una config de una web app 
Retorna error 404 si la web app no existe o 500 si hay un error de base de datos.
*/
module.exports.deleteWebAppConfig = async (id) => {
    try {
        const response = await WebAppConfigPersistence.deleteWebAppConfig(id);
        //Se revisa si existia una web app con ese id
        if (response.result.n == 1) {
            return response;
        } else {
            throw Error('Esta config de web App config no existe');
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
