const express = require('express');
const router = express.Router();

router.use('/pruebas', require('./PruebasIndex'));
router.use('/web', require('./WebAppIndex'));
router.use('/mobile', require('./MobileAppIndex'));
router.use('/testResults', require('./TestsResultsAPI'));
router.use('/vrtResults', require('./VRTResultsAPI'));
router.use('/tests', require('./TestsAPI'));
router.use('/versions', require('./VersionsAPI'));
router.use('/upload', require('./FilesUploadAPI'));
module.exports = router;
