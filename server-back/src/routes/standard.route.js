const express = require('express');
const router = express.Router();
const standardController = require('../controllers/standard.controller');

router.get('/', standardController.getAll);

module.exports = router;