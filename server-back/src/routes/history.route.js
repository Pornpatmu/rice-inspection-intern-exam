const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const { upload } = require('../services/fileUpload.service');


router.get('/', historyController.getAll);
router.get('/:id', historyController.getbyID);
router.post('/', upload.single('fileUpload'), historyController.create);
// router.patch('/:id', historyController.update);
// router.delete('/:id', historyController.delete);

module.exports = router;