const express = require('express');
const router = express.Router();

router.use('/pruebas', require('./PruebasIndex'));
router.use('/web', require('./WebAppIndex'));
router.use('/tests', require('./TestsAPI'));
router.use('/versions', require('./VersionsAPI'));
router.use('/upload', require('./FilesUploadAPI'));
module.exports = router;
