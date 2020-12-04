const express = require('express');
const router = express.Router();
const HistoricoLogic = require('../logic/HistoricoLogic');

/*
GET all the tests
*/
router.get('/:config', (req, res) => {
    const config = req.params.config;
    HistoricoLogic.getHistorico(config)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(err.errCode || 400).send(err.errMsg);
        });
});

/*
GET all the tests
*/
router.get('/logs/:config/:num', (req, res) => {
    const config = req.params.config;
    const num = req.params.num;
    HistoricoLogic.getLogs(config, num)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(err.errCode || 400).send(err.errMsg);
        });
});

module.exports = router;
