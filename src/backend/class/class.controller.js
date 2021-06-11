const ClassModel = require("./class.model");
const User = require("../user/user.model");

async function getClasess(req, res) {
    try {
        const docs = await ClassModel.find({}).sort("name").populate("updated_by", "forename surname");

        res.json(docs);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function createClass(req, res, next) {
    try {
        let doc = new ClassModel({
            name: req.body.name,
            created_by: req.user._id,
            updated_by: req.user._id
        });

        doc = await doc.save();
        doc = await doc.populate("updated_by", "forename surname").execPopulate();

        res.json(doc);
    } catch(err) {
        next(err);
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

async function updateClass(req, res, next) {
    try {
        let doc = await ClassModel.findOne({ _id: req.params.id });

        doc.name = req.body.name;
        doc.updated_by = req.user._id;

        doc = await doc.save();

        res.json(doc);
    } catch(err) {
        next(err);
    }
}

async function getSubjects(req, res) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id }).sort({ updated_at: "descending" }).select("-name -pupils").populate({
            path: "subjects",
            select: "name status teacher updated_at",
            populate: { path: "teacher", select: "forename surname" }
        });

        res.json(doc.subjects);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function addSubject(req, res, next) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.id });

        const subject = doc.subjects.create({
            name: req.body.name,
            teacher: req.body.teacher,
            created_by: req.user._id,
            updated_by: req.user._id
        });

        doc.subjects.push(subject);
        await doc.save();

        subject.teacher = await User.findById(req.body.teacher, "forename surname").exec();

        res.json(subject);
    } catch(err) {
        next(err);
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

async function updateSubject(req, res, next) {
    try {
        const doc = await ClassModel.findById(req.params.class_id).exec();
        const subject = doc.subjects.id(req.params.subject_id);

        if(subject.status === "archived") return res.status(400).send("No further changes can be made anymore to archived subject.");

        if(req.body.status && req.body.status === "archived") {
            if(!subject.tests.length) return res.status(400).send("Only subjects with dependent tests can be archived.");
            subject.status = req.body.status;
        } else {
            doc.subjects.id(req.params.subject_id).name = req.body.name;
            doc.subjects.id(req.params.subject_id).teacher = req.body.teacher;
            doc.subjects.id(req.params.subject_id).updated_by = req.user.id;
        }

        await doc.save();
        subject.teacher = await User.findById(subject.teacher, "forename surname").exec();

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function deleteSubject(req, res, next) {
    try {
        const doc = await ClassModel.findOne({ _id: req.params.class_id });

        doc.subjects.id(req.params.subject_id).remove();
        await doc.save();

        res.json({ _id: req.params.subject_id });
    } catch(err) {
        next(err);
    }
}

async function batchEnrolment(req, res, next) {
    try {
        const doc = await ClassModel.findByIdAndUpdate(req.params.id, { pupils: req.body.pupils }, { new: true });

        res.json(doc);
    } catch(err) {
        next(err);
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
exports.batchEnrolment = batchEnrolment;
