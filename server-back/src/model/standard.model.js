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