const HistoryService = require('../services/history.service');
const FileUploadService = require('../services/fileUpload.service');

exports.getAll = async (req, res) => {
    try {
        const filter = {
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
            inspectionID: req.query.inspectionID,
        };
        const data = await HistoryService.getAll(filter);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await HistoryService.getbyID(id);
        console.log(data);
        res.json({ data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.create = async (req, res) => {
    try {
        const data = req.body;
        let imageLink = null;

        if (req.file) {
            imageLink = FileUploadService.getImageLink(req.file.path);
        } else {
            imageLink = FileUploadService.getImageLinkFromRaw();
        }
        console.log('file:', req.file);      
        console.log('imageLink:', imageLink);
        const filePath = req.file ? req.file.path : null;
        const result = await HistoryService.create({ ...data, fileUpload: filePath, imageLink });        
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await HistoryService.update(id, data);
        res.json({ message: 'History updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await HistoryService.delete(id);
        res.json({ message: 'History deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.getResult = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await HistoryService.getResult(id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};