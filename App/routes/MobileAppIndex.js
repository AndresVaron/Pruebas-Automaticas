const express = require('express');
const router = express.Router();
const MobileAppLogic = require('../logic/MobileAppLogic');

/*
Método GET encargado de ejecutar una config
*/
router.post('/:id/versiones/:id_version/configs/:id_config', (req, res) => {
    const id_config = req.params.id_config;
    MobileAppLogic.execMobileAppConfig(id_config, res);
});
module.exports = router;
