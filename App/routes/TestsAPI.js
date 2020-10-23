const express = require('express');
const router = express.Router();
const { postTest, getTests } = require('../logic/TestsLogic');

/*
POST that creates a new test
*/
router.post('/:aut', (req, res) => {
    const { aut } = req.params;
    const newTest = req.body || {};
    postTest(aut, newTest)
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(err.errCode || 400).send(err.errMsg);
        });
});

/*
GET all the tests
*/
router.get('/:aut', (req, res) => {
    const { aut } = req.params;
    getTests(aut, true, req.query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(err.errCode || 400).send(err.errMsg);
        });
});

module.exports = router;
