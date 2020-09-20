const express = require('express');
const router = express.Router();
const WebAppLogic = require('../logic/WebAppLogic');
const WebAppConfigLogic = require('../logic/WebAppConfigLogic');

/*
Retorna las apps web
*/
router.get('/', (req, res) => {
    WebAppLogic.fetchWebApps(Boolean(req.query.mobile == 'true'))
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Elimina una app web.
*/
router.delete('/:id', (req, res) => {
    const _id = req.params.id;
    WebAppLogic.deleteWebApp(_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(err.errCode).send(err.errMsg);
        });
});

/*
Método POST encargado de crear una app web
*/
router.post('/', (req, res) => {
    const webApp = {};
    webApp.nombre = req.body.nombre;
    WebAppLogic.postWebApp(webApp, Boolean(req.query.mobile == 'true'))
        .then((data) => res.status(201).send(data))
        .catch((err) => {
            res.status(err.errCode).send(err.errMsg);
        });
});

/*
Método POST encargado de crearle una version a una app web
*/
router.post('/:id/versiones', (req, res) => {
    const version = {};
    version.version = req.body.version;
    version.url = req.body.url;
    version.id_app = req.params.id;
    WebAppLogic.postWebAppVersion(version)
        .then((data) => res.status(201).send(data))
        .catch((err) => {
            res.status(err.errCode).send(err.errMsg);
        });
});

/*
Método Get encargado retornar la app con su version actual
*/
router.get('/:id/versiones/:id_version', (req, res) => {
    const id_app = req.params.id;
    const id_version = req.params.id_version;
    WebAppLogic.fetchWebAppVersion(id_app, id_version)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Método GET encargado de retorna todas las configuraciones de una app.
*/
router.get('/:id/versiones/:id_version/configs', (req, res) => {
    const id_version = req.params.id_version;
    WebAppConfigLogic.fetchWebAppVersionConfigs(id_version)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Método GET encargado de retorna todas las configuraciones de una app.
*/
router.post('/:id/versiones/:id_version/configs', (req, res) => {
    const id_version = req.params.id_version;
    WebAppConfigLogic.postWebAppVersionConfig(id_version)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Método GET encargado de retorna todas las configuraciones de una app.
*/
router.get('/:id/versiones/:id_version/configs/:id_config', (req, res) => {
    const id_app = req.params.id;
    const id_version = req.params.id_version;
    const id_config = req.params.id_config;
    WebAppConfigLogic.getWebAppVersionConfig(id_app, id_version, id_config)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Método PUT encargado de actualizar una configuracion
*/
router.put('/:id/versiones/:id_version/configs/:id_config', (req, res) => {
    const config = {};
    config.nombre = req.body.nombre;
    config.pruebas = req.body.pruebas;
    WebAppConfigLogic.updateWebAppVersionConfig(req.params.id_config, config)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

/*
Elimina una app web config
*/
router.delete('/:id/versiones/:id_version/configs/:id_config', (req, res) => {
    const id_config = req.params.id_config;
    WebAppConfigLogic.deleteWebAppConfig(id_config)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(err.errCode).send(err.errMsg);
        });
});
module.exports = router;
