const Standard = require('../model/standard.model');

exports.getAll = async () => {
    const standards = await Standard.getAll();

    const data = await Promise.all(standards.map(async (standard) => {
        const subStandards = await Standard.getSubStandards(standard.standardID);
        
        return {
            name: standard.name,
            id: standard.standardID,
            createDate: standard.createdAt,
            standardData: subStandards.map(sub => ({
                key: sub.key,
                minLength: sub.minLength,
                maxLength: sub.maxLength,
                shape: sub.shape,
                name: sub.name,
                conditionMin: sub.conditionMin,
                conditionMax: sub.conditionMax,
            }))
        };
    }));

    return data;
};