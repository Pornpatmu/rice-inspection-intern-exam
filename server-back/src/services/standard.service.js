const Standard = require('../model/standard.model');

exports.getAll = async () => {
    const standards = await Standard.getAll();
    const data = await Promise.all(standards.map(async (standard) => {
        const subStandards = await Standard.getSubStandards(standard.standardID);
        return Standard.formatStandardGetAll(standard, subStandards);
    }));

    return data;
};