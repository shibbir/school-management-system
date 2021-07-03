const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const { capitalize } = require("lodash");

const Subject = require("./subject.model");
const Test = require("../manage-tests/test.model");
const User = require("../manage-users/user.model");
const Program = require("../manage-classes/class.model");
const TestResult = require("../manage-test-results/test-result.model");
const { archiveTests } = require("../manage-tests/test.controller");

async function getSubjects(req, res, next) {
    try {
        const subjects = await Subject.findAll({
            attributes: ["id", "name", "status", "updated_at"],
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
                    as: "tests",
                    attributes: ["id"]
                },
                {
                    model: Program,
                    as: "classes",
                    attributes: ["id", "name"],
                    through: { attributes: [] }
                }
            ]
        });

        res.json(subjects);
    } catch(err) {
        next(err);
    }
}

async function addSubject(req, res, next) {
    try {
        const { name, teacher_id } = req.body;

        const matched_name = await Subject.count({ where: {
            name: { [Op.iLike]: name }
        }});

        if(matched_name) {
            return res.status(400).send("Subject name already exists. Please try with a different name.");
        }

        const teacher_count = await User.count({ where: { id: teacher_id, role: "teacher" }});

        if(!teacher_count) {
            return res.status(400).send("Invalid teacher.");
        }

        const entity = await Subject.create({
            name,
            teacher_id
        });

        const subject = await Subject.findByPk(entity.id, {
            attributes: ["id", "name", "status", "updated_at"],
            include: {
                model: User,
                as: "teacher",
                attributes: ["forename", "surname"]
            }
        });

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function getSubject(req, res, next) {
    try {
        const subject = await Subject.findByPk(req.params.id, {
            attributes: ["id", "name", "status", "teacher_id"]
        });

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
                as: "tests",
                attributes: ["id"]
            }
        });

        if(subject.status === "archived") return res.status(400).send("No further changes can be made to archived subjects.");

        if(status === "archived") {
            if(!subject.tests.length) return res.status(400).send("Only subjects with dependent tests can be archived.");

            subject.status = "archived";

            await subject.save();
            await archiveTests(req.params.id, req.user.id);
        } else {
            const matched_name = await Subject.count({ where: {
                name: { [Op.iLike]: name },
                id: { [Op.ne]: req.params.id }
            }});

            if(matched_name) {
                return res.status(400).send("Subject name already exists. Please try with a different name.");
            }

            const teacher_count = await User.count({ where: { id: teacher_id, role: "teacher" }});

            if(!teacher_count) {
                return res.status(400).send("Invalid teacher.");
            }

            subject.name = name;
            subject.teacher_id = teacher_id;

            await subject.save();
        }

        subject = await Subject.findByPk(req.params.id, {
            attributes: ["id", "name", "status", "updated_at"],
            include: [
                {
                    model: User,
                    as: "teacher",
                    attributes: ["forename", "surname"]
                },
                {
                    model: Program,
                    as: "classes",
                    attributes: ["id", "name"],
                    through: { attributes: [] }
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
            include: [
                {
                    model: Test,
                    as: "tests"
                },
                {
                    model: Program,
                    as: "classes",
                    through: { where: { subject_id: req.params.id }, attributes: [] }
                }
            ]
        });

        if(subject.tests.length) return res.status(400).send("Only subjects without dependent tests can be removed.");

        if(subject.status === "archived") return res.status(400).send("No further changes can be made to archived subjects.");

        await Subject.destroy({ where: { id: req.params.id }});

        await subject.removeClasses(subject.classes);

        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

async function getPupilGrades(req, res, next) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            attributes: ["id"],
            include: [
                {
                    model: TestResult,
                    as: "test_results",
                    attributes: ["id", "pupil_id", "grade"],
                    include: {
                        model: User,
                        as: "pupil",
                        attributes: ["id", "forename", "surname"]
                    }
                },
                {
                    model: Subject,
                    as: "subject",
                    attributes: ["name"]
                }
            ]
        });

        let results = [];

        tests.forEach(test => {
            test.test_results.forEach(test_result => {
                let pupil = results.find(x => x.pupil_id === test_result.pupil_id);
                if(pupil) {
                    pupil.grade = pupil.grade + +test_result.grade;
                } else {
                    results.push({
                        pupil_id: test_result.pupil_id,
                        pupil_name: `${test_result.pupil.forename} ${test_result.pupil.surname}`,
                        subject_name: test.subject.name,
                        grade: +test_result.grade
                    });
                }
            });
        });

        results = results.map(result => {
            result.grade = (result.grade / tests.length).toFixed(2);
            return result;
        });

        res.json(results);

    } catch(err) {
        next(err);
    }
}

async function archiveOrDeleteSubjects(class_id) {
    const program = await Program.findByPk(class_id, {
        include: {
            model: Subject,
            as: "subjects",
            through: { where: { class_id }, attributes: [] },
            include: {
                model: Test,
                as: "tests",
                attributes: ["id"]
            }
        }
    });

    await program.removeSubjects(program.subjects);

    await Promise.all(program.subjects.map(async subject => {
        if(subject.tests.length) {
            subject.status = "archived";

            await subject.save();

            await archiveTests(subject.id);
        } else {
            await Subject.destroy({ where: { id: subject.id }});
        }
    }));
}

async function exportData(req, res, next) {
    try {
        const subjects = await Subject.findAll({
            attributes: ["id", "name", "status", "created_at", "updated_at"],
            order: [
                ["name"]
            ],
            include: [
                {
                    model: User,
                    as: "teacher",
                    attributes: ["forename", "surname"]
                }
            ]
        });

        if(!subjects || !subjects.length) return res.status(400).send("No data found.");

        const data = [];

        subjects.forEach(function(subject) {
            data.push({
                "Subject ID": subject.id,
                Subject: subject.name,
                Status: capitalize(subject.status),
                "Assigned Teacher": `${subject.teacher.forename} ${subject.teacher.surname}`,
                "Created At": new Date(subject.created_at).toLocaleDateString("en-US"),
                "Updated At": new Date(subject.updated_at).toLocaleDateString("en-US")
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("subjects.csv");
        res.send(csv);
    } catch(err) {
        next(err);
    }
}

async function exportPupilGrades(req, res, next) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            attributes: ["id"],
            include: [
                {
                    model: TestResult,
                    as: "test_results",
                    attributes: ["id", "pupil_id", "grade"],
                    include: {
                        model: User,
                        as: "pupil",
                        attributes: ["id", "forename", "surname"]
                    }
                },
                {
                    model: Subject,
                    as: "subject",
                    attributes: ["name"]
                }
            ]
        });

        let results = [];

        tests.forEach(test => {
            test.test_results.forEach(test_result => {
                let pupil = results.find(x => x.pupil_id === test_result.pupil_id);
                if(pupil) {
                    pupil.grade = pupil.grade + +test_result.grade;
                } else {
                    results.push({
                        pupil_id: test_result.pupil_id,
                        pupil_name: `${test_result.pupil.forename} ${test_result.pupil.surname}`,
                        grade: +test_result.grade,
                        subject_name: test.subject.name
                    });
                }
            });
        });

        results = results.map(result => {
            result.grade = (result.grade / tests.length).toFixed(2);
            return result;
        });

        if(!results.length) return res.status(400).send("No data found.");

        const data = [];

        results.forEach(function(result) {
            data.push({
                "Matriculation Number": result.pupil_id,
                "Pupil Name": result.pupil_name,
                Subject: result.subject_name,
                Grade: result.grade
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("pupil-grades.csv");
        res.send(csv);
    } catch(err) {
        next(err);
    }
}

exports.addSubject = addSubject;
exports.getSubjects = getSubjects;
exports.getSubject = getSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
exports.getPupilGrades = getPupilGrades;
exports.archiveOrDeleteSubjects = archiveOrDeleteSubjects;
exports.exportData = exportData;
exports.exportPupilGrades = exportPupilGrades;
