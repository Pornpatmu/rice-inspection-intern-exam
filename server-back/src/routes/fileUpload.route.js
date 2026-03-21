const express = require('express');
const router = express.Router();
const upload = require('../services/fileUpload.service');

router.post('/', upload.single('file'), fileUploadController.upload);

module.exports = router;

