const express = require('express');
const router = express.Router();
const { PostUploadFile } = require('../logic/FilesUploadLogic');

// Uploads a new file
router.post('', PostUploadFile);

module.exports = router;