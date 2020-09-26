const express = require('express');
const router = express.Router();
const { postVersion } = require('../logic/VersionsLogic');

/*
POST that creates a new version
*/
router.post('/:test', (req, res) => {
    const { test } = req.params;
    const newVersion = req.body || {};
    postVersion(test, newVersion).then(data => {
        res.status(201).send(data);
    }).catch(err => {
        res.status(err.errCode || 400).send(err.errMsg);
    });
});

module.exports = router;