const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const VersionsPersistence = require('../persistence/VersionsPersistence');
const { fetchWebAppVersion } = require('../persistence/AppVersionsPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const executeMobileMonkey = require('../utils/ExecuteMobileMonkey');
/*
Método encargado de obtener todas las apps web
*/
module.exports.execMobileAppConfig = async (id, res) => {
    const appVersionConfig = await WebAppConfigPersistence.fetchWebAppVersionConfig(id);
    if (appVersionConfig === null) {
        return res.status(400).send('No existe una configuracion con este id');
    } else {
        //Se ejecuta el comando en consola
        const currentVersion = await VersionsPersistence.fetchVersion(appVersionConfig.pruebas[0][0]);
        if (!currentVersion) {
            errorJson.errMsg = 'No se encontró la versión de la prueba a ejecutar';
            throw errorJson;
        }
        const appVersion = await fetchWebAppVersion(appVersionConfig.id_version);
        if (!appVersion) {
            return res.status(400).send('No se encontró la versión de la aplicación a probar');
        }
        const currentApp = await WebAppPersistence.fetchApp(appVersion.id_app);
        if (!currentApp) {
            return res.status(400).send('No se encontró la aplicación a probar');
        }
        res.send(true);
        executeMobileMonkey(appVersionConfig, currentVersion, appVersion, currentApp);
    }
};
