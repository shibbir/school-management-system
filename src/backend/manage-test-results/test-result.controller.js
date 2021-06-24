const fs = require("fs");
const csvParse = require("csv-parse");
const { Parser } = require("json2csv");

const User = require("../manage-users/user.model");
const TestResult = require("./test-result.model");
const Test = require("../manage-tests/test.model");
const Subject = require("../manage-subjects/subject.model");
const Program = require("../manage-classes/class.model");

async function getTestResults(req, res, next) {
    try {
        const test_results = await TestResult.findAll({
            where: { test_id: req.params.id },
            attributes: ["id", "grade", "updated_at"],
            include: [
                {
                    model: User,
                    as: "pupil",
                    attributes: ["id", "forename", "surname"]
                }
            ]
        });

        res.json(test_results);
    } catch(err) {
        next(err);
    }
}

async function createTestResult(req, res, next) {
    try {
        const { pupil_id, grade } = req.body;

        const pupil = await TestResult.findOne({ where: { pupil_id, test_id: req.params.id }});

        if(pupil) return res.status(400).send("This pupil already has a grade. Please consider updating or removing the previous grade.");

        const entity = await TestResult.create({
            test_id: req.params.id,
            pupil_id,
            grade,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        const test_result = await TestResult.findByPk(entity.id, {
            attributes: ["id", "grade", "updated_at"],
            include: {
                model: User,
                as: "pupil",
                attributes: ["id", "forename", "surname"]
            }
        });

        res.json(test_result);
    } catch(err) {
        next(err);
    }
}

async function getTestResult(req, res, next) {
    try {
        const test_result = await TestResult.findByPk(req.params.id, {
            attributes: ["id", "pupil_id", "grade", "updated_at"]
        });

        res.json(test_result);
    } catch(err) {
        next(err);
    }
}

async function updateTestResult(req, res, next) {
    try {
        const { grade } = req.body;

        await TestResult.update({
            grade,
            updated_by: req.user.id
        }, {
            where: { id: req.params.id }
        });

        const test_result = await TestResult.findByPk(req.params.id, {
            attributes: ["id", "grade", "updated_at"],
            include: {
                model: User,
                as: "pupil",
                attributes: ["id", "forename", "surname"]
            }
        });

        res.json(test_result);
    } catch(err) {
        next(err);
    }
}

async function deleteTestResult(req, res, next) {
    try {
        const number_of_destroyed_rows = await TestResult.destroy({ where: { id: req.params.id }});

        if(!number_of_destroyed_rows) return res.status(404).send("No data found.");

        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

async function downloadSampleBatchGradeFile(req, res) {
    try {
        const test = await Test.findByPk(req.params.id, {
            include: {
                model: Subject,
                as: "subject",
                attributes: ["id"],
                include: {
                    model: Program,
                    as: "class",
                    attributes: ["id"],
                    include: {
                        model: User,
                        as: "pupils",
                        attributes: ["id", "forename", "surname"]
                    }
                }
            }
        });

        const data = [];

        if(test && test.subject && test.subject.class && test.subject.class.pupils) {
            test.subject.class.pupils.forEach(pupil => {
                data.push({
                    "Matriculation Number": pupil.id,
                    Forename: pupil.forename,
                    Surname: pupil.surname,
                    Grade: 0
                });
            });
        } else {
            data.push({
                "Matriculation Number": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                Forename: "John",
                Surname: "Doe",
                Grade: 0
            });
        }

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("sample-batch-grade-file.csv");
        res.send(csv);
    } catch(err) {
        next(err);
    }
}

async function importTestResults(req, res, next) {
    try {
        const test = await Test.findByPk(req.params.id, {
            include: {
                model: Subject,
                as: "subject",
                attributes: ["id", "status"]
            }
        });

        if(test && test.subject && test.subject.status === "archived") return res.status(400).send("No further changes can be made to a test of an archived subjects.");

        let test_results = [];

        fs.createReadStream(req.file.path).pipe(csvParse({
            columns: true,
            skip_empty_lines: true
        })).on("data", function(row) {
            test_results.push({
                test_id: req.params.id,
                pupil_id: row["Matriculation Number"],
                grade: row["Grade"],
                created_by: req.user.id,
                updated_by: req.user.id
            });
        }).on("end", async function() {
            await fs.promises.unlink(req.file.path);

            test_results = await TestResult.bulkCreate(test_results, {
                updateOnDuplicate: ["grade", "updated_by", "updated_at"]
            });

            res.sendStatus(204);
        });
    } catch(err) {
        next(err);
    }
}

async function archiveTestResults(test_id, updated_by) {
    await TestResult.update({
        status: "archived",
        updated_by: updated_by
    }, { where: {
        test_id: test_id
    }});
}

exports.getTestResults = getTestResults;
exports.createTestResult = createTestResult;
exports.getTestResult = getTestResult;
exports.updateTestResult = updateTestResult;
exports.deleteTestResult = deleteTestResult;
exports.importTestResults = importTestResults;
exports.archiveTestResults = archiveTestResults;
exports.downloadSampleBatchGradeFile = downloadSampleBatchGradeFile;
