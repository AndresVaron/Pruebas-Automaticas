const WebAppPersistence = require('../persistence/WebAppPersistence');
const TestsLogic = require('./TestsLogic');
const WebAppConfigLogic = require('./WebAppConfigLogic');

/* 
Método encargado de obtener todas las apps web
*/
module.exports.fetchWebApps = async (mobile, id = null) => {
    try {
        return await WebAppPersistence.fetchWebApps(mobile, id);
    } catch (err) {
        const errJson = {
            error: new Error(),
            errMsg: err.toString(),
            errCode: 500,
        };
        throw errJson;
    }
};

/* 
Método encargado de validar reglas del negocio para persistir una web app. 
Retorna error 400 si alguna de las reglas de negocio no se cumple o 500 si hay un error de base de datos.
*/
module.exports.postWebAppVersion = async (version) => {
    const errJson = {
        errMsg: '',
        errCode: 500,
    };
    let err = false;
    if (
        version.version === undefined ||
        typeof version.version !== 'string' ||
        version.version === ''
    ) {
        //Append mensaje de error correspondiente
        err = true;
        errJson.errMsg +=
            'Version de la WebAppVersion incorrecto o undefined \n';
    }

    if (
        version.url === undefined ||
        typeof version.url !== 'string' ||
        version.url === ''
    ) {
        //Append mensaje de error correspondiente
        err = true;
        errJson.errMsg += 'Url de la WebAppVersion incorrecto o undefined \n';
    }

    // En caso de error se lanza una respuesta de tipo 400 con los errores
    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    //Se intenta crear la webapp
    try {
        const response = await WebAppPersistence.fetchWebApp(version.id_app);
        if (response.length === 0) {
            const errJson = {
                errMsg: 'No existe una webapp con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        } else {
            if (
                response[0].versiones.find((ver) => ver.url === version.url) !==
                undefined
            ) {
                const errJson = {
                    errMsg: 'Ya existe una version con esta url',
                    errCode: 400,
                };
                errJson.error = new Error();
                throw errJson;
            }
            if (
                response[0].versiones.find(
                    (ver) => ver.version === version.version
                ) !== undefined
            ) {
                const errJson = {
                    errMsg: 'Ya existe una version con esta version',
                    errCode: 400,
                };
                errJson.error = new Error();
                throw errJson;
            }
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

    //Se intenta crear la webapp
    try {
        const finalWebAppVersion = {};
        finalWebAppVersion.version = version.version;
        finalWebAppVersion.url = version.url;
        const today = new Date(Date.now());
        finalWebAppVersion.fechaCreacion = new Date(
            Date.now() - today.getTimezoneOffset() * 60 * 1000
        );
        const response = await WebAppPersistence.insertWebAppVersion(
            version.id_app,
            finalWebAppVersion
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

/* 
Método encargado de validar reglas del negocio para persistir una web app. 
Retorna error 400 si alguna de las reglas de negocio no se cumple o 500 si hay un error de base de datos.
*/
module.exports.postWebApp = async (webApp, mobile) => {
    const errJson = {
        errMsg: '',
        errCode: 500,
    };
    let err = false;
    if (
        webApp.nombre === undefined ||
        typeof webApp.nombre !== 'string' ||
        webApp.nombre === ''
    ) {
        //Append mensaje de error correspondiente
        err = true;
        errJson.errMsg += 'Nombre de la WebApp incorrecto o undefined \n';
    }

    // En caso de error se lanza una respuesta de tipo 400 con los errores
    if (err) {
        errJson.errCode = 400;
        errJson.error = new Error();
        throw errJson;
    }

    //Se intenta crear la webapp
    try {
        const finalWebApp = {};
        finalWebApp.nombre = webApp.nombre;
        finalWebApp.mobile = mobile;
        if (mobile) {
            finalWebApp.package = webApp.package;
        }
        const today = new Date(Date.now());
        finalWebApp.fechaCreacion = new Date(
            Date.now() - today.getTimezoneOffset() * 60 * 1000
        );
        const response = await WebAppPersistence.insertWebApp(finalWebApp);
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

/* 
Método encargado de borrar una web app 
Retorna error 404 si la web app no existe o 500 si hay un error de base de datos.
*/
module.exports.deleteWebApp = async (id) => {
    try {
        //Se borran todas las versiones, las configuraciones de cada version
        const response = await WebAppPersistence.fetchWebApp(id);
        if (response.length === 0) {
            const errJson = {
                errMsg: 'No existe una webapp con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        }
        if (response[0].mobile) {
            console.log('MOBILE!');
        } else {
            for (const version of response[0].versiones) {
                await deleteWebAppVersion(version._id);
            }
            await TestsLogic.deleteWebAppTests(id);
        }

        const delresponse = await WebAppPersistence.deleteWebApp(id);
        //Se revisa si existia una web app con ese id
        if (delresponse.result.n == 1) {
            return delresponse;
        } else {
            throw Error('Esta web App no existe');
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
const deleteWebAppVersion = async (idVersion) => {
    try {
        const configs = await WebAppPersistence.fetchWebAppVersionConfigs(
            idVersion
        );

        for (const config of configs) {
            await WebAppConfigLogic.deleteWebAppConfig(config._id);
        }
        const delresponse = await WebAppPersistence.deleteWebAppVersion(
            idVersion
        );
        //Se revisa si existia una web app con ese id
        if (delresponse.result.n == 1) {
            return delresponse;
        } else {
            throw Error('Esta web App no existe');
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

/* 
Método encargado de obtener una webappversion
*/
module.exports.fetchWebAppVersion = async (idApp, id) => {
    try {
        const response = await WebAppPersistence.fetchWebApp(idApp);
        if (response.length === 0) {
            const errJson = {
                errMsg: 'No existe una webapp con este id',
                errCode: 400,
            };
            errJson.error = new Error();
            throw errJson;
        } else {
            const found = response[0].versiones.find(
                (ver) => ver._id.toString() === id
            );
            if (found === undefined) {
                const errJson = {
                    errMsg: 'No existe una version con este id',
                    errCode: 400,
                };
                errJson.error = new Error();
                throw errJson;
            }
            response[0].version = found;
            delete response[0]['versiones'];
            return response[0];
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
