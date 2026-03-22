const db = require('../db');
const Standard = require('../model/standard.model');

exports.getAll = async (filter = {}) => {
    let query = `SELECT i.*, s.name as standardName 
        FROM Inspection i
        LEFT JOIN Standard s ON i.standardID = s.standardID
        WHERE 1=1`;
    const params = [];
    if (filter.fromDate) {
        query += ' AND i.samplingDate >= ?';
        params.push(filter.fromDate);
    }
    if (filter.toDate) {
        query += ' AND i.samplingDate <= ?';
        params.push(filter.toDate);
    }
    if (filter.inspectionID) {
        query += ' AND i.inspectionID = ?';
        params.push(filter.inspectionID);
    }
    const [rows] = await db.query(query, params);
    return rows;
};

exports.getbyID = async (id) => {
    const [rows] = await db.query(
        `SELECT i.*, s.name as standardName 
        FROM Inspection i
        LEFT JOIN Standard s ON i.standardID = s.standardID
        WHERE i.inspectionID = ?`,
        [id]
    );
    return rows[0];

}

exports.create = async (data) => {
    const { nanoid } = await import('nanoid');
    const generateInspectionID = () => `EC-${nanoid(4)}-${nanoid(4)}`;
    const inspectionID = generateInspectionID();

    await db.query(
        `INSERT INTO Inspection 
        (name, imageLink, inspectionID, standardID, note, samplingDate, samplingPoint, price, fileUpload)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.name,
            data.imageLink || null,
            inspectionID,
            data.standardID,
            data.note || null,
            data.samplingDate || null,
            data.samplingPoint || null,
            data.price || null,
            data.fileUpload || null
        ]
    );

    const inspection = await exports.getbyID(inspectionID);
    return exports.formatHistoryInsert(inspection);
};

exports.update = async (id, data) => {


}

exports.delete = async (id) => {

}

exports.formatHistoryInsert = (inspection) => ({
    name: inspection.name,
    inspectionID: inspection.inspectionID,
    standardID: inspection.standardID,
    note: inspection.note,
    samplingDate: inspection.samplingDate,
    samplingPoint: inspection.samplingPoint || '[]',
    price: inspection.price,
    imageLink: inspection.imageLink,
});

exports.formatHistory = (inspection, subStandards) => ({
    name: inspection.name,
    createDate: inspection.createdAt,
    inspectionID: inspection.inspectionID,
    standardID: inspection.standardID,
    note: inspection.note,
    standardName: inspection.standardName,
    samplingDate: inspection.samplingDate,
    samplingPoint: inspection.samplingPoint,
    price: inspection.price,
    imageLink: inspection.imageLink,
    standardData: Standard.formatSubStandards(subStandards)
});


exports.formatHistoryGetAll = (inspection) => ({
    name: inspection.name,
    createDate: inspection.createdAt,
    inspectionID: inspection.inspectionID,
    standardID: inspection.standardID,
    note: inspection.note,
    standardName: inspection.standardName,
    samplingDate: inspection.samplingDate,
    samplingPoint: inspection.samplingPoint,
    price: inspection.price,
});

