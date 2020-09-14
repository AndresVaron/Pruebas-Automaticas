const express = require('express');
const router = express.Router();

router.use('/pruebas', require('./PruebasIndex'));
router.use('/web', require('./WebAppIndex'));

module.exports = router;
