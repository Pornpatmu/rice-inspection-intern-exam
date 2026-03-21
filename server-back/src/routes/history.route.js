const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');


router.get('/', historyController.getAll);
router.get('/:id', historyController.getbyID);
router.post('/', historyController.create);
router.patch('/:id', historyController.update);
router.delete('/:id', historyController.delete);

module.exports = router;