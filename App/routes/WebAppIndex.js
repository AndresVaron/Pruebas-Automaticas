const express = require('express');
const router = express.Router();
const WebAppLogic = require('../logic/WebAppLogic');

/*
Retorna las apps web
*/
router.get('/', (req, res) => {
    WebAppLogic.fetchWebApps()
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
    WebAppLogic.postWebApp(webApp)
        .then((data) => res.status(201).send(data))
        .catch((err) => {
            res.status(err.errCode).send(err.errMsg);
        });
});

/*
Método POST encargado de crearle una version a una app web
*/
router.post('/:id/versions', (req, res) => {
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

module.exports = router;
