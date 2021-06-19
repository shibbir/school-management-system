const Subject = require("./subject.model");
const Test = require("../manage-tests/test.model");
const User = require("../manage-users/user.model");
const Program = require("../manage-classes/class.model");
const TestResult = require("../manage-test-results/test-result.model");
const { archiveTests } = require("../manage-tests/test.controller");

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
                as: "tests",
                attributes: ["id"]
            }
        });

        if(subject.status === "archived") return res.status(400).send("No further changes can be made to archived subjects.");

        if(status === "archived") {
            if(!subject.tests.length) return res.status(400).send("Only subjects with dependent tests can be archived.");

            subject.status = "archived";
            subject.updated_by = req.user.id;

            await subject.save();
            await archiveTests(req.params.id, req.user.id);
        } else {
            subject.name = name;
            subject.teacher_id = teacher_id;
            subject.updated_by = req.user.id;

            await subject.save();
        }

        subject = await Subject.findByPk(req.params.id, {
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

async function getPupilGrades(req, res, next) {
    try {
        const tests = await Test.findAll({
            where: { subject_id: req.params.id },
            attributes: ["id", "subject_id", "name", "date"],
            include: {
                model: TestResult,
                as: "test_results",
                attributes: ["id", "test_id", "pupil_id", "grade"],
                include: {
                    model: User,
                    as: "pupil",
                    attributes: ["id", "forename", "surname"]
                }
            }
        });

        const result = [];

        tests.forEach(test => {
            test.test_results.forEach(test_result => {
                let pupil = result.find(x => x.pupil_id === test_result.pupil_id);
                if(pupil) {
                    pupil.grade = pupil.grade + +test_result.grade;
                } else {
                    result.push({
                        pupil_id: test_result.pupil_id,
                        forename: test_result.pupil.forename,
                        surname: test_result.pupil.surname,
                        grade: +test_result.grade
                    });
                }
            });
        });

        res.json(result);

    } catch(err) {
        next(err);
    }
}

async function archiveOrDeleteSubjects(class_id, updated_by) {
    const subjects = await Subject.findAll({
        where: { class_id },
        include: [{
            model: Test,
            as: "tests",
            attributes: ["id"]
        }],
        attributes: ["id"]
    });

    await Promise.all(subjects.map(async subject => {
        if(subject.tests.length) {
            subject.class_id = null;
            subject.status = "archived";
            subject.updated_by = updated_by;

            await subject.save();

            await archiveTests(subject.id, updated_by);
        } else {
            await Subject.destroy({ where: { id: subject.id }});
        }
    }));
}

exports.getSubjects = getSubjects;
exports.getSubjectsByClass = getSubjectsByClass;
exports.addSubject = addSubject;
exports.getSubject = getSubject;
exports.updateSubject = updateSubject;
exports.deleteSubject = deleteSubject;
exports.getPupilGrades = getPupilGrades;
exports.archiveOrDeleteSubjects = archiveOrDeleteSubjects;
