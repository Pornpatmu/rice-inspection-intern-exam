const History = require('../model/history.model');
const Standard = require('../model/standard.model');

exports.getAll = async (filter) => {
    const histories = await History.getAll(filter);
    const data = await Promise.all(histories.map(async (h) => {
        return History.formatHistoryGetAll(h);
    }));
    return { data };
};
exports.getbyID = async (id) => {
    const history = await History.getbyID(id);
    const subStandards = await Standard.getSubStandards(history.standardID);
    return History.formatHistory(history, subStandards);
};
exports.create = async (data) => {
    const inspection = await History.create(data);
    const subStandards = await Standard.getSubStandards(inspection.standardID);
    return History.formatHistory(inspection, subStandards);
};
exports.update = async (id, data) => {
    return await History.update(id, data);
};

exports.delete = async (id) => {
    return await History.delete(id);
};