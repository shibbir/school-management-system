const fs = require("fs");
const parse = require("csv-parse");
const User = require("../user/user.model");
const Test = require("./test.model");
const Subject = require("../subject/subject.model");
const TestResult = require("./test-result.model");

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

async function getTestResults(req, res, next) {
    try {
        const test_results = await TestResult.findAll({
            where: { test_id: req.params.id },
            include: [
                {
                    model: User,
                    as: "pupil",
                    attributes: ["forename", "surname"]
                },
                {
                    model: User,
                    as: "modifier",
                    attributes: ["forename", "surname"]
                }
            ]
        });

        res.json(test_results);
    } catch(err) {
        next(err);
    }
}

async function uploadTestResults(req, res, next) {
    try {
        const test_results = [];

        fs.createReadStream(req.file.path).pipe(parse({
            columns: true,
            skip_empty_lines: true
        })).on("data", function(row) {
            test_results.push({
                test_id: req.params.id,
                pupil_id: row["Pupil ID"],
                grade: row["Grade"],
                updated_by: req.user.id
            });
        }).on("end", async function() {
            test_results = await TestResult.bulkCreate(test_results, {
                updateOnDuplicate: ["grade", "updated_by", "updated_at"]
            });
            res.json(test_results);
        });
    } catch(err) {
        next(err);
    }
}

exports.getTests = getTests;
exports.createTest = createTest;
exports.getTest = getTest;
exports.updateTest = updateTest;
exports.getTestResults = getTestResults;
exports.uploadTestResults = uploadTestResults;
