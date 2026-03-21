const History = require('../model/history.service');
const rawData = require('../dara/raw.json');
const multer = require('multer');

exports.getAll = async (req, res) => {
  try {
    const data = await History.getAll();
    console.log(data);  
    res.json({ data });
  } catch (err) {
    console.log(err);   
    res.status(500).json({ message: err.message });
  }
};

exports.getbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await History.getbyID(id);
        console.log(data);  
        res.json({ data });
    } catch (err) {
        console.log(err);   
        res.status(500).json({ message: err.message });
    }       
}

exports.create = async (req, res) => {
    try {
        const data = req.body;
        const result = await History.create(data);
        res.json({ message: 'History created successfully', id: result.insertId });
    } catch (err) {
        console.log(err);   
        res.status(500).json({ message: err.message });
    }                                           
}

exports.update = async (req, res) => {      
    try {
        const id = req.params.id;
        const data = req.body;
        await History.update(id, data);
        res.json({ message: 'History updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await History.delete(id);
        res.json({ message: 'History deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }   
}