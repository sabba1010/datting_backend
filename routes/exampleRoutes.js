const express = require('express');
const router = express.Router();
const { getExampleData } = require('../controllers/exampleController');

// Route definition
router.get('/test', getExampleData);

module.exports = router;
