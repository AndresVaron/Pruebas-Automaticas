const express = require('express');
const router = express.Router();
const TestsResultsLogic = require('../logic/TestsResultsLogic');
/*
POST vrt test
*/
router.post('', (req, res) => {
    TestsResultsLogic.postTestResults(req.body)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.errCode).send(err.errMsg));
});

module.exports = router;
