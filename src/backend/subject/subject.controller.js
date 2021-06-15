const Test = require("../manage-tests/test.model");
const Subject = require("./subject.model");
const User = require("../user/user.model");
const Program = require("../class/class.model");

async function getSubjects(req, res, next) {
    try {
        const query = {};

        if(req.params.teacher_id) {
            query.teacher_id = req.params.teacher_id;
        }

        const subjects = await Subject.findAll({
            where: query,
            order: [
                ["created_at", "DESC"]
            ],
            include: [{
                model: Program,
                as: "class",
                attributes: ["id", "name"]
            }]
        });

        res.json(subjects);
    } catch(err) {
        next(err);
    }
}

async function getSubjectsByClass(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.id, {
            include: {
                model: Subject,
                as: "subjects",
                order: [
                    ["created_at", "DESC"]
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
            }
        });

        res.json(program.subjects);
    } catch(err) {
        next(err);
    }
}

async function addSubject(req, res, next) {
    try {
        const { name, teacher_id } = req.body;

        const entity = await Subject.create({
            name,
            teacher_id,
            class_id: req.params.id,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        const subject = await Subject.findByPk(entity.id, {
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
        });

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function getSubject(req, res, next) {
    try {
        const subject = await Subject.findByPk(req.params.id);

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function updateSubject(req, res, next) {
    try {
        const { name, teacher_id, status } = req.body;

        let subject = await Subject.findByPk(req.params.id, {
            include: {
                model: Test,
                as: "tests"
            }
        });

        if(subject.status === "archived") return res.status(400).send("No further changes can be made to archived subjects.");

        if(status === "archived" && !subject.tests.length) return res.status(400).send("Only subjects with dependent tests can be archived.");

        const values = {
            name,
            teacher_id,
            updated_by: req.user.id
        };

        if(status) values.status = status;

        await Subject.update(values, {
            where: { id: req.params.id }
        });

        subject = await Subject.findByPk(req.params.id, {
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
        });

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function deleteSubject(req, res, next) {
    try {
        const subject = await Subject.findByPk(req.params.id, {
            include: {
                model: Test,
                as: "tests"
            }
        });

        if(subject.tests.length) return res.status(400).send("Only subjects without dependent tests can be removed.");

        if(subject.status === "archived") return res.status(400).send("No further changes can be made to archived subjects.");

        await Subject.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

exports.getSubjects = getSubjects;
exports.getSubjectsByClass = getSubjectsByClass;
exports.addSubject = addSubject;
exports.getSubject = getSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
