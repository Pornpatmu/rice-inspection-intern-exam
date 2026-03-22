const db = require('../db');

exports.getAll = async () => {
    const [standards] = await db.query('SELECT * FROM Standard');
    console.log(standards[0]);
    return standards;
};

exports.getSubStandards = async (standardID) => {
    const [subStandards] = await db.query(
        'SELECT * FROM SubStandard WHERE standardID = ?',
        [standardID]
    );
    return subStandards;
};

exports.formatStandardGetAll = (standard, subStandards) => ({
    name: standard.name,
    id: standard.standardID,
    createdAt: standard.createdAt,
    standardData: exports.formatSubStandards(subStandards)
});

exports.formatSubStandards = (subStandards) => 
    subStandards.map(sub => ({
        key: sub.key,
        minLength: sub.minLength,
        maxLength: sub.maxLength,
        shape: sub.shape,
        name: sub.name,
        conditionMin: sub.conditionMin,
        conditionMax: sub.conditionMax,
    }));