const Test = require("./test.model");
const Subject = require("../manage-subjects/subject.model");
const { archiveTestResults } = require("../manage-test-results/test-result.controller");

async function getTests(req, res) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            order: [
                ["created_at", "DESC"]
            ]
        });

        res.json(tests);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function createTest(req, res) {
    try {
        const { name, date } = req.body;

        const entity = await Test.create({
            name,
            date,
            subject_id: req.params.id
        });

        const test = await Test.findByPk(entity.id);

        res.json(test);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getTest(req, res) {
    try {
        const test = await Test.findByPk(req.params.id);

        res.json(test);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function updateTest(req, res) {
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

        await entity.save();

        const test = await Test.findByPk(req.params.id);

        res.json(test);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function deleteTest(req, res) {
    try {
        await Test.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function archiveTests(subject_id) {
    const tests = await Test.findAll({
        where: { subject_id: subject_id },
        attributes: ["id"]
    });

    await Promise.all(tests.map(async test => {
        test.status = "archived";

        await test.save();

        await archiveTestResults(test.id);
    }));
}

exports.getTests = getTests;
exports.createTest = createTest;
exports.getTest = getTest;
exports.updateTest = updateTest;
exports.deleteTest = deleteTest;
exports.archiveTests = archiveTests;
