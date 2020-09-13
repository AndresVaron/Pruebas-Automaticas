const express = require('express');
const router = express.Router();
const PruebasLogic = require('../logic/PruebasLogic');

/*
Retorna las pruebas
*/
router.get('/', (req, res) => {
    PruebasLogic.fetchEmpresas()
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

module.exports = router;
