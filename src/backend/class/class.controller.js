const crypto = require("crypto");
const mongoose = require("mongoose");
const ClassModel = require("./class.model");
const User = require("../user/user.model");

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

async function getSubjects(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id }).select("-name -pupils").populate({
            path: "subjects",
            select: "name status teacher updated_at",
            populate: { path: "teacher", select: "forename surname" }
        });

        res.json(doc.subjects);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function addSubject(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id });

        const subject = doc.subjects.create({
            name: req.body.name,
            teacher: req.body.teacher_id,
            created_by: req.user._id,
            updated_by: req.user._id
        });

        doc.subjects.push(subject);
        await doc.save();

        subject.teacher = await User.findOne({ _id: req.body.teacher_id }).select("-password");

        res.json(subject);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function getSubject(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.class_id });

        const subject = doc.subjects.id(req.params.subject_id);

        res.json(subject);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function updateSubject(req, res) {
    try {

    } catch(err) {
        res.sendStatus(500);
    }
}

async function deleteSubject(req, res) {
    try {

    } catch(err) {
        res.sendStatus(500);
    }
}

exports.getClasess = getClasess;
exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
exports.getSubjects = getSubjects;
exports.addSubject = addSubject;
exports.getSubject = getSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
