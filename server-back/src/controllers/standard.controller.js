const StandardService = require('../services/standard.service');

exports.getAll = async (req, res) => {
  try {
    const data = await StandardService.getAll();
    console.log(data);  
    res.json({ data });
  } catch (err) {
    console.log(err);   
    res.status(500).json({ message: err.message });
  }
};