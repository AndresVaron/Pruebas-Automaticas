const { query } = require('express');
const express = require('express');
const router = express.Router();
const { getTestResults } = require('../logic/TestsResultsLogic');

/*
GET all the tests results
*/
router.get('/:aut', (req, res) => {
    const { aut } = req.params;
    getTestResults(aut, req.query).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(400).send(err.errMsg);
    });
});


module.exports = router;