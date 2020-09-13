const express = require('express');
const router = express.Router();

router.use('/pruebas', require('./PruebasIndex'));

module.exports = router;
