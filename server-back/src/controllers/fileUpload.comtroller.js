const FileUploadService = require('../services/fileUpload.service');

exports.upload = async (req, res) => {
    try {
        const filePath = req.file ? req.file.path : null;
        if (!filePath) return res.status(400).json({ message: 'No file uploaded' });

        res.json({ message: 'success', filePath });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};