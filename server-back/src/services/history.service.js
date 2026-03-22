const HistoryModel = require('../model/history.model');
const StandardModel = require('../model/standard.model');
const fileUploadService = require('../services/fileUpload.service');

// เช็คเงื่อนไข length ว่าตรงกับ condition มั้ย
const checkConditionMaxMin = (value, condition, threshold) => {
    switch (condition) {
        case 'LT': return value < threshold;
        case 'LE': return value <= threshold;
        case 'GT': return value > threshold;
        case 'GE': return value >= threshold;
        default: return false;
    }
};
exports.calculate = (grains, standardData) => {
    // รวม weight ทั้งหมดเพื่อคำนวณ %
    const totalWeight = grains.reduce((sum, g) => sum + g.weight, 0);

    // Composition: จัดกลุ่มเม็ดข้าวตาม subStandard
    // โดยเช็ค shape และ length ว่าตรงเงื่อนไขของแต่ละ subStandard มั้ย
    const composition = standardData.map(sub => {
        const matched = grains.filter(g =>
            sub.shape.includes(g.shape) &&
            checkConditionMaxMin(g.length, sub.conditionMin, sub.minLength) &&
            checkConditionMaxMin(g.length, sub.conditionMax, sub.maxLength)
        );
        const weight = matched.reduce((sum, g) => sum + g.weight, 0);
        return {
            key: sub.key,
            name: sub.name,
            minLength: sub.minLength,
            maxLength: sub.maxLength,
            actual: totalWeight > 0 ? (weight / totalWeight) * 100 : 0,
        };
    });

    // Defect: จัดกลุ่มเม็ดข้าวตาม type
    // เช่น yellow, paddy, damage ฯลฯ
    const defectTypes = ['yellow', 'paddy', 'damage', 'chalky', 'red', 'undeveloped', 'foreign'];
    const defect = defectTypes.map(type => {
        const matched = grains.filter(g => g.type === type);
        const weight = matched.reduce((sum, g) => sum + g.weight, 0);
        return {
            name: type,
            actual: totalWeight > 0 ? (weight / totalWeight) * 100 : 0,
        };
    });
    return { composition, defect };
};

exports.getAll = async (filter) => {
    const histories = await HistoryModel.getAll(filter);
    const data = await Promise.all(histories.map(async (h) => {
        return HistoryModel.formatHistoryGetAll(h);
    }));
    return { data };
};

// history.service.js
exports.getbyID = async (id) => {
    if (!id) throw new Error('ID is required'); 
    const history = await HistoryModel.getbyID(id);
    if (!history) throw new Error('History not found');  
    const subStandards = await StandardModel.getSubStandards(history.standardID);
    return HistoryModel.formatHistory(history, subStandards);
};

exports.create = async (data) => {
    const { grains, totalSample } = data.fileUpload
        ? fileUploadService.getGrains(data.fileUpload)
        : fileUploadService.getGrainsFromRaw();

    const subStandards = await StandardModel.getSubStandards(data.standardID);
    const { composition, defect } = exports.calculate(grains, subStandards);
    const inspection = await HistoryModel.create({ ...data, totalSample });
    console.log('inspection:', inspection);
    await HistoryModel.createInspectionResult(inspection.inspectionID, composition, defect);
    return {
        ...HistoryModel.formatHistory(inspection, subStandards),
        composition,
        defect
    };
};

exports.getResult = async (id) => {
    return await HistoryModel.getResultsByInspectionID(id);
};

exports.update = async (id, data) => {
    return await HistoryModel.update(id, data);
};

exports.delete = async (id) => {
    return await HistoryModel.delete(id);
};
