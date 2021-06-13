const Program = require("./class.model");
const User = require("../user/user.model");
const Test = require("../subject/test.model");
const Subject = require("../subject/subject.model");

async function getClasess(req, res, next) {
    try {
        const classes = await Program.findAll({
            include: [
                {
                    model: User,
                    as: "pupils",
                    attributes: ["forename", "surname"]
                },
                {
                    model: Subject,
                    as: "subjects",
                    attributes: ["id", "name"]
                }
            ],
            order: [
                ["updated_at", "DESC"]
            ]
        });

        res.json(classes);
    } catch(err) {
        next(err);
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

async function getClass(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.id);

        res.json(program);
    } catch(err) {
        next(err);
    }
}

async function updateClass(req, res, next) {
    try {
        let program = await Program.findByPk(req.params.id);

        let = await program.update({
            name: req.body.name,
            updated_by: req.user.id
        }, { returning: true });

        res.json(program);
    } catch(err) {
        next(err);
    }
}

async function getSubjects(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.id, {
            include: [{
                model: Subject,
                as: "subjects",
                order: [
                    ["updated_at", "DESC"]
                ],
                include: [
                    {
                        model: User,
                        as: "teacher",
                        attributes: ["forename", "surname"]
                    },
                    {
                        model: Test,
                        as: "tests"
                    }
                ]
            }]
        });

        res.json(program.subjects);
    } catch(err) {
        next(err);
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

async function getSubject(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.class_id, {
            include: {
                model: Subject,
                as: "subjects",
                where: { id: req.params.subject_id }
            }
        });

        res.json(program.subjects[0]);
    } catch(err) {
        next(err);
    }
}

async function updateSubject(req, res, next) {
    try {
        const { name, teacher_id, status } = req.body;

        const subject = await Subject.findByPk(req.params.subject_id, {
            include: {
                model: Test,
                as: "tests"
            }
        });

        if(subject.status === "archived") return res.status(400).send("No further changes can be made anymore to archived subject.");

        if(status && status === "archived") {
            if(!subject.tests.length) return res.status(400).send("Only subjects with dependent tests can be archived.");
            subject.status = status;
        } else {
            subject.name = name;
            subject.teacher_id = teacher_id;
            updated_by = req.user.id;
        }

        await subject.save();
        subject.teacher = await User.findByPk(subject.teacher_id, { attributes: ["forename", "surname"] });

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
        const classes = await ClassModel.find({});

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
