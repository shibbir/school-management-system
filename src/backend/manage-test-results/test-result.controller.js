const fs = require("fs");
const { Op } = require("sequelize");
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

async function exportTestResults(req, res, next) {
    try {
        const test_results = await TestResult.findAll({
            where: { test_id: req.params.id },
            attributes: ["id", "grade", "updated_at"],
            include: [
                {
                    model: User,
                    as: "pupil",
                    attributes: ["id", "forename", "surname"]
                },
                {
                    model: Test,
                    as: "test",
                    attributes: ["name", "date"]
                }
            ]
        });

        if(!test_results || !test_results.length) return res.status(400).send("No data found.");

        const data = [];

        test_results.forEach(function(test_result) {
            data.push({
                "Test Name": test_result.test.name,
                "Test Date": new Date(test_result.test.date).toLocaleDateString("en-US"),
                "Matriculation Number": test_result.pupil.id,
                "Pupil Name": `${test_result.pupil.forename} ${test_result.pupil.surname}`,
                "Grade": Number.parseFloat(test_result.grade).toFixed(2),
                "Updated At": new Date(test_result.updated_at).toLocaleDateString("en-US")
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("test-results.csv");
        res.send(csv);
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
            grade: Number.parseFloat(grade).toFixed(2),
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
            grade: Number.parseFloat(grade).toFixed(2),
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

async function downloadSampleBatchGradeFile(req, res, next) {
    try {
        const test = await Test.findByPk(req.params.id, {
            include: {
                model: Subject,
                as: "subject",
                attributes: ["id"],
                include: {
                    model: Program,
                    as: "classes",
                    attributes: ["id"],
                    through: { attributes: [] }
                }
            }
        });

        const data = [];

        if(test && test.subject && test.subject.classes && test.subject.classes.length) {
            const pupils = await User.findAll({
                attributes: ["id", "forename", "surname"],
                where: {
                    role: "pupil",
                    class_id: {
                        [Op.in]: [...test.subject.classes.map(x => x.id)]
                    }
                }
            });

            pupils.forEach(pupil => {
                data.push({
                    "Matriculation Number": pupil.id,
                    Forename: pupil.forename,
                    Surname: pupil.surname,
                    Grade: 0
                });
            });
        }

        if(!data.length) {
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

        const current_test_results = await TestResult.findAll({ where: { test_id: req.params.id }, raw: true });
        const new_test_results = [];

        let pupil_id;
        let grade;

        fs.createReadStream(req.file.path).pipe(csvParse({
            columns: true,
            skip_empty_lines: true
        })).on("data", async function(row) {

            pupil_id = row["Matriculation Number"];
            grade = +row["Grade"];

            if(current_test_results.find(x => x.pupil_id === pupil_id)) {
                await TestResult.update({
                    grade: Number.parseFloat(grade).toFixed(2),
                    updated_by: req.user.id
                }, { where: { test_id: req.params.id, pupil_id }});
            } else {
                new_test_results.push({
                    test_id: req.params.id,
                    pupil_id,
                    grade: Number.parseFloat(grade).toFixed(2),
                    created_by: req.user.id,
                    updated_by: req.user.id
                });
            }
        }).on("end", async function() {
            await fs.promises.unlink(req.file.path);

            await TestResult.bulkCreate(new_test_results, {
                ignoreDuplicates: false
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
exports.exportTestResults = exportTestResults;
exports.createTestResult = createTestResult;
exports.getTestResult = getTestResult;
exports.updateTestResult = updateTestResult;
exports.deleteTestResult = deleteTestResult;
exports.importTestResults = importTestResults;
exports.archiveTestResults = archiveTestResults;
exports.downloadSampleBatchGradeFile = downloadSampleBatchGradeFile;
