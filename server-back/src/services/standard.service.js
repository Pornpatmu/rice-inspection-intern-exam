const StandardModel = require('../model/standard.model');

exports.getAll = async () => {
    const standards = await StandardModel.getAll();
    const data = await Promise.all(standards.map(async (standard) => {
        const subStandards = await StandardModel.getSubStandards(standard.standardID);
        return StandardModel.formatStandardGetAll(standard, subStandards);
    }));

    return data;
};