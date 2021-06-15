const User = require("../user/user.model");
const Test = require("./test.model");
const Subject = require("../subject/subject.model");

async function getTests(req, res, next) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            include: [
                {
                    model: User,
                    as: "modifier",
                    attributes: ["forename", "surname"]
                }
            ],
            order: [
                ["created_at", "DESC"]
            ]
        });

        res.json(tests);
    } catch(err) {
        next(err);
    }
}

async function createTest(req, res, next) {
    try {
        const { name, date } = req.body;

        const entity = await Test.create({
            name,
            date,
            subject_id: req.params.id,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        const test = await Test.findByPk(entity.id, {
            include: [
                {
                    model: User,
                    as: "modifier",
                    attributes: ["forename", "surname"]
                }
            ]
        });

        res.json(test);
    } catch(err) {
        next(err);
    }
}

async function getTest(req, res, next) {
    try {
        const test = await Test.findByPk(req.params.id);

        res.json(test);
    } catch(err) {
        next(err);
    }
}

async function updateTest(req, res, next) {
    try {
        const { name, date } = req.body;

        const entity = await Test.findByPk(req.params.id, {
            include: {
                model: Subject,
                as: "subject",
                attributes: ["id", "status"]
            }
        });

        if(entity.subject.status === "archived") return res.status(400).send("Manipulation of tests are not allowed for archived subjects.");

        entity.name = name;
        entity.date = date;
        entity.updated_by = req.user.id;

        await entity.save();

        const test = await Test.findByPk(req.params.id, {
            include: {
                model: User,
                as: "modifier",
                attributes: ["forename", "surname"]
            }
        });

        res.json(test);
    } catch(err) {
        next(err);
    }
}

async function deleteTest(req, res, next) {
    try {
        await Test.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

exports.getTests = getTests;
exports.createTest = createTest;
exports.getTest = getTest;
exports.updateTest = updateTest;
exports.deleteTest = deleteTest;
