const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadsPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

exports.getImageLink = (filePath) => {
    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return fileContent.imageURL || null;
};

exports.getImageLinkFromRaw = () => {
    const rawPath = path.join(uploadsPath, 'raw');
    
    if (!fs.existsSync(rawPath) || !fs.lstatSync(rawPath).isDirectory()) {
        return null;
    }
    
    const files = fs.readdirSync(rawPath);
    if (files.length > 0) {
        const rawContent = JSON.parse(fs.readFileSync(path.join(rawPath, files[0]), 'utf8'));
        return rawContent.imageURL || null;
    }
    return null;
};

exports.upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Only JSON files are allowed'));
        }
    }
});
