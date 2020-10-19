const { query } = require('express');
const express = require('express');
const router = express.Router();
const { getVRTResults, postVRTResult } = require('../logic/VRTResultsLogic');

/*
GET all the tests results
*/
router.get('/:aut', (req, res) => {
    const { aut } = req.params;
    getVRTResults(aut, req.query).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(400).send(err.errMsg);
    });
});

/*
POST vrt test
*/
router.post('/:aut', (req, res) => {
    const { aut } = req.params;

    postVRTResult(aut, req.body).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(400).send(err.errMsg);
    });
});

module.exports = router;