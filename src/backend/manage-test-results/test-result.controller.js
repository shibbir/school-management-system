const fs = require("fs");
const parse = require("csv-parse");

const User = require("../manage-users/user.model");
const TestResult = require("./test-result.model");

async function getTestResults(req, res, next) {
    try {
        const test_results = await TestResult.findAll({
            where: { test_id: req.params.id },
            include: [
                {
                    model: User,
                    as: "pupil",
                    attributes: ["id", "forename", "surname"]
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
        const test_result = await TestResult.findByPk(req.params.id);

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
        await TestResult.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

async function importTestResults(req, res, next) {
    try {
        let test_results = [];

        fs.createReadStream(req.file.path).pipe(parse({
            columns: true,
            skip_empty_lines: true
        })).on("data", function(row) {
            test_results.push({
                test_id: req.params.id,
                pupil_id: row["Pupil ID"],
                grade: row["Grade"],
                created_by: req.user.id,
                updated_by: req.user.id
            });
        }).on("end", async function() {
            await fs.promises.unlink(req.file.path);

            test_results = await TestResult.bulkCreate(test_results, {
                updateOnDuplicate: ["grade", "updated_by", "updated_at"]
            });

            res.json(test_results);
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
