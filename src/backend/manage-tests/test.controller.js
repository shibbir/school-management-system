const Test = require("./test.model");
const User = require("../manage-users/user.model");
const Subject = require("../manage-subjects/subject.model");
const { archiveTestResults } = require("../manage-test-results/test-result.controller");

async function getTests(req, res, next) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            attributes: ["id", "name", "date", "status", "updated_at"],
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
            attributes: ["id", "name", "date", "status", "updated_at"],
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

async function archiveTests(subject_id, updated_by) {
    const tests = await Test.findAll({
        where: { subject_id: subject_id },
        attributes: ["id"]
    });

    await Promise.all(tests.map(async test => {
        test.status = "archived";
        test.updated_by = updated_by;

        await test.save();

        await archiveTestResults(test.id, updated_by);
    }));
}

exports.getTests = getTests;
exports.createTest = createTest;
exports.getTest = getTest;
exports.updateTest = updateTest;
exports.deleteTest = deleteTest;
exports.archiveTests = archiveTests;
