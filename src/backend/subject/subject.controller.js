const { exception } = require("console");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Subject = require("./subject.model");

const convertToSlug = string => string.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

async function getSubjects(req, res) {
    try {
        const docs = await Subject.find({ class_id: req.query.class_id }).sort("name");

        res.json(docs);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function createSubject(req, res) {
    try {
        let doc = new Subject({
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

async function getSubject(req, res) {
    try {
        const doc = await Subject.findOne({ _id: req.params.id });

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function updateSubject(req, res) {
    try {
        const doc = await Subject.findOne({ _id: req.params.id });

        doc.name = req.body.name;

        doc = await doc.save();

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

exports.getSubjects = getSubjects;
exports.createSubject = createSubject;
exports.getSubject = getSubject;
exports.updateSubject = updateSubject;
