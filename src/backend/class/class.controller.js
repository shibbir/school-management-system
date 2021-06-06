const { exception } = require("console");
const crypto = require("crypto");
const mongoose = require("mongoose");
const ClassModel = require("./class.model");

const convertToSlug = string => string.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

async function getClasess(req, res) {
    try {
        const docs = await ClassModel.find({}).sort("name");

        res.json(docs);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function createClass(req, res) {
    try {
        let doc = new ClassModel({
            name: req.body.name,
            slug: convertToSlug(req.body.name),
            created_by: req.user._id,
            updated_by: req.user._id
        });

        doc = await doc.save();

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function getClass(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id });

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function updateClass(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id });

        doc.name = req.body.name;

        doc = await doc.save();

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

exports.getClasess = getClasess;
exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
