const db = require('../db');

exports.save = async (filePath) => {
    const [result] = await db.query(
        'INSERT INTO Inspection (fileUpload) VALUES (?)',
        [filePath]
    );
    return result;
};