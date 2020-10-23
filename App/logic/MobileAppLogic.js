const WebAppConfigPersistence = require('../persistence/WebAppConfigPersistence');
const VersionsPersistence = require('../persistence/VersionsPersistence');
const { fetchWebAppVersion } = require('../persistence/AppVersionsPersistence');
const WebAppPersistence = require('../persistence/WebAppPersistence');
const executeMobileMonkey = require('../utils/ExecuteMobileMonkey');
const executeVRT = require('../utils/ExecuteVRT');
const { prepareMobileApp, uninstallApp } = require('../utils/PrepareMobileApp');

/*
Método encargado de obtener todas las apps web
*/
module.exports.execMobileAppConfig = async (id, res) => {
    const appVersionConfig = await WebAppConfigPersistence.fetchWebAppVersionConfig(id);
    if (appVersionConfig === null) {
        return res.status(400).send('No existe una configuracion con este id');
    } else {
        //Se ejecuta el comando en consola
        const testsToMake = appVersionConfig.pruebas.flat();
        const testsVersions = await VersionsPersistence.findVersions({ _id: { $in: testsToMake } });
        if (!testsVersions || testsVersions.length !== testsToMake.length) {
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
        executeTests(appVersionConfig, testsVersions, appVersion, currentApp);
    }
};

const executeTests = async (appVersionConfig, testsVersions, appVersion, currentApp) => {
    const directory = `./mobileApps/${currentApp._id}/versions/${appVersion._id}`;
    const packageName = currentApp.package;
    const deviceName = await prepareMobileApp(appVersion, currentApp, directory, packageName);
    if (deviceName) {
        for (let index = 0; index < testsVersions.length; index++) {
            const test = testsVersions[index];
            uninstallApp(packageName);
            if (test.events) {
                await executeMobileMonkey(test, directory, packageName);
                console.log('Monkey finished');
            } else {
                await executeVRT(test, directory, packageName, deviceName, appVersion);
                console.log('VRT finished');
            }
        }
    }
};