const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const { capitalize } = require("lodash");

const User = require("./user.model");
const Program = require("../manage-classes/class.model");
const Subject = require("../manage-subjects/subject.model");
const Test = require("../manage-tests/test.model");
const TestResult = require("../manage-test-results/test-result.model");
const { generateAccessToken, generateRefreshToken } = require("../core/security.middleware");

function formatUserProfile(user) {
    const profile = {
        id: user.id,
        username: user.username,
        forename: user.forename,
        surname: user.surname,
        role: user.role
    };

    return profile;
}

async function login(req, res) {
    try {
        let user;
        const { username, password, grant_type } = req.body;

        if(grant_type === "password") {
            user = await User.findOne({ where: {
                username: {
                    [Op.iLike]: username
                }
            }});

            if(!user || !user.validPassword(password)) {
                return res.status(401).send("Username or password is invalid.");
            }

            user.refresh_token = generateRefreshToken(user);
            await user.save();
        }

        res.cookie("access_token", generateAccessToken(user), { httpOnly: true, sameSite: true, signed: true });
        res.cookie("refresh_token", user.refresh_token, { httpOnly: true, sameSite: true, signed: true });

        res.json(formatUserProfile(user));
    } catch (err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.sendStatus(204);
}

async function getUserProfile(req, res) {
    res.json(formatUserProfile(req.user));
}

async function getUser(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refresh_token", "created_at"] },
        });

        res.json(formatUserProfile(user));
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getUsers(req, res) {
    try {
        const query = {};

        if(req.query.role) {
            query.role = req.query.role;
        }

        if(req.query.subject_id) {
            const subject = await Subject.findByPk(req.query.subject_id, {
                attributes: [],
                include: [
                    {
                        model: Program,
                        as: "classes",
                        attributes: ["id"],
                        through: { attributes: [] }
                    },
                    {
                        model: Test,
                        as: "tests",
                        attributes: ["id"],
                        include: {
                            model: TestResult,
                            as: "test_results",
                            attributes: ["id", "pupil_id"]
                        }
                    }
                ]
            });

            if(subject && subject.classes && subject.classes.length) {
                query.class_id = {
                    [Op.in]: [...subject.classes.map(x => x.id)]
                };
            }

            const pupil_ids = [];
            if(subject && subject.tests) {
                subject.tests.forEach(test => {
                    test.test_results.forEach(test_result => {
                        pupil_ids.push(test_result.pupil_id);
                    });
                });
            }

            if(pupil_ids.length) {
                if(query.class_id) {
                    query[Op.or] = [
                        { id: { [Op.in]: pupil_ids }},
                        { class_id: query.class_id }
                    ];

                    delete query.class_id;
                } else {
                    query.id = {
                        [Op.in]: pupil_ids
                    };
                }
            }
        }

        const users = await User.findAll({
            where: query,
            attributes: { exclude: ["password", "refresh_token", "created_at"] },
            order: [
                ["role"],
                ["forename"]
            ],
            include: [
                {
                    model: Program,
                    as: "class",
                    attributes: ["name"]
                }
            ]
        });

        res.json(users);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function createUser(req, res) {
    try {
        const { forename, surname, username, password, role } = req.body;

        const matched_username = await User.count({ where: {
            username: username.toLowerCase()
        }});

        if(matched_username) return res.status(400).send("Username already exists. Please try with a different one.");

        const entity = await User.create({
            role,
            forename,
            surname,
            username,
            password
        });

        const user = await User.findByPk(entity.id, {
            attributes: { exclude: ["password", "refresh_token"] }
        });

        res.json(formatUserProfile(user));
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function updateUser(req, res) {
    try {
        const { username, forename, surname } = req.body;

        if(req.user.role !== "admin" && req.user.id !== req.params.id) {
            return res.status(403).send("Access Forbidden.");
        }

        const matched_user = await User.count({ where: {
            id: req.params.id
        }});

        if(!matched_user) {
            return res.status(400).send("User does not exists.");
        }

        const matched_username = await User.count({ where: {
            username: { [Op.iLike]: username },
            id: { [Op.ne]: req.params.id }
        }});

        if(matched_username) {
            return res.status(400).send("Username already exists. Please try with a different one.");
        }

        await User.update({
            forename,
            surname,
            username
        }, { where: { id: req.params.id }});

        const user = await User.findByPk(req.params.id, {
            attributes: ["id", "forename", "surname", "username", "role"]
        });

        res.json(user);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function deleteUser(req, res) {
    try {
        if(req.params.id === req.user.id) return res.status(400).send("You cannot remove yourself.");

        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Subject,
                as: "subjects"
            }]
        });

        if(user.role === "teacher" && user.subjects.find(x => x.status === "active")) {
            res.status(400).send("Teachers cannot be removed while they are assigned to at least one non-archived subject.");
        }

        await User.destroy({ where: { id: req.params.id }});
        res.json({ id: req.params.id });
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function changePassword(req, res) {
    try {
        const { current_password, new_password } = req.body;

        const user = await User.findByPk(req.user.id);

        if (!user || !user.validPassword(current_password)) return res.status(400).send("Current password is incorrect.");

        user.password = new_password;

        await user.save();

        res.status(204).send("Password updated successfully.");
    } catch (err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getAssignedSubjects(req, res) {
    try {
        const subjects = await Subject.findAll({
            where: { teacher_id: req.params.id },
            attributes: ["id", "name", "status", "updated_at"],
            order: [
                ["name"]
            ],
            include: {
                model: Program,
                as: "classes",
                attributes: ["id", "name"],
                through: { attributes: [] }
            }
        });

        res.json(subjects);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getPupilSubjects(req, res) {
    try {
        const pupil = await User.findByPk(req.params.id, {
            attributes: ["class_id"]
        });

        const subjects = await Subject.findAll({
            attributes: ["id", "name"],
            include: [
                {
                    model: Program,
                    as: "classes",
                    attributes: ["id"],
                    through: { where: { class_id: pupil.class_id }, attributes: []}
                },
                {
                    model: User,
                    as: "teacher",
                    attributes: ["forename", "surname"]
                },
                {
                    model: Test,
                    as: "tests",
                    attributes: ["id", "name"],
                    include: {
                        model: TestResult,
                        as: "test_results",
                        attributes: ["test_id", "pupil_id", "grade"]
                    }
                }
            ]
        });

        const response = [];

        subjects.forEach(subject => {
            let test_results_sum = 0;
            let is_assigned_subject = false;

            subject.tests.forEach(test => {
                if(test.test_results && test.test_results.length) {
                    let test_result = test.test_results.find(x => x.pupil_id === req.params.id && x.test_id === test.id);
                    if(test_result) {
                        test_results_sum += +test_result.grade;
                        is_assigned_subject = true;
                    }
                }
            });

            if(pupil.class_id && subject.classes.find(x => x.id === pupil.class_id)) {
                is_assigned_subject = true;
            }

            if(is_assigned_subject) {
                response.push({
                    subject_id: subject.id,
                    subject_name: subject.name,
                    teacher_name: `${subject.teacher.forename} ${subject.teacher.surname}`,
                    grade: Number.parseFloat(subject.tests && subject.tests.length ? test_results_sum / subject.tests.length : 0).toFixed(2)
                });
            }
        });

        res.json(response);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getPupilSubject(req, res) {
    try {
        const subject = await Subject.findByPk(req.params.subject_id, {
            attributes: ["id", "name"],
            include: {
                model: Test,
                as: "tests",
                attributes: ["id", "name", "date"],
                include: {
                    model: TestResult,
                    as: "test_results",
                    attributes: ["pupil_id", "grade"]
                }
            }
        });

        res.json(subject);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function exportData(req, res) {
    try {
        const users = await User.findAll({
            attributes: ["id", "forename", "surname", "username", "role", "created_at", "updated_at"],
            order: [
                ["role"],
                ["forename"]
            ],
            raw: true
        });

        if(!users.length) return res.status(400).send("No data found.");

        const data = [];

        users.forEach(function(user) {
            data.push({
                "User ID": user.id,
                Role: capitalize(user.role),
                Forename: user.forename,
                Surname: user.surname,
                Username: user.username,
                "Created At": new Date(user.created_at).toLocaleDateString("en-US"),
                "Updated At": new Date(user.updated_at).toLocaleDateString("en-US")
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("users.csv");
        res.send(csv);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function exportAssignedSubjects(req, res) {
    try {
        const subjects = await Subject.findAll({
            where: { teacher_id: req.params.id },
            attributes: ["id", "name", "status", "created_at", "updated_at"],
            order: [
                ["name"]
            ],
            raw: true
        });

        if(!subjects.length) return res.status(400).send("No data found.");

        const data = [];

        subjects.forEach(function(subject) {
            data.push({
                "Subject ID": subject.id,
                Name: subject.name,
                Status: capitalize(subject.status),
                "Created At": new Date(subject.created_at).toLocaleDateString("en-US"),
                "Updated At": new Date(subject.updated_at).toLocaleDateString("en-US")
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("assigned-subjects.csv");
        res.send(csv);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function exportPupilSubjects(req, res) {
    try {
        const pupil = await User.findByPk(req.params.id, {
            attributes: ["id", "class_id", "forename", "surname"]
        });

        const subjects = await Subject.findAll({
            attributes: ["id", "name"],
            include: [
                {
                    model: Program,
                    as: "classes",
                    attributes: ["id"],
                    through: { where: { class_id: pupil.class_id }, attributes: []}
                },
                {
                    model: User,
                    as: "teacher",
                    attributes: ["forename", "surname"]
                },
                {
                    model: Test,
                    as: "tests",
                    attributes: ["id", "name"],
                    include: {
                        model: TestResult,
                        as: "test_results",
                        attributes: ["test_id", "pupil_id", "grade"]
                    }
                }
            ]
        });

        const response = [];

        subjects.forEach(subject => {
            let test_results_sum = 0;
            let is_assigned_subject = false;

            subject.tests.forEach(test => {
                if(test.test_results && test.test_results.length) {
                    let test_result = test.test_results.find(x => x.pupil_id === req.params.id && x.test_id === test.id);
                    if(test_result) {
                        test_results_sum += +test_result.grade;
                        is_assigned_subject = true;
                    }
                }
            });

            if(pupil.class_id && subject.classes.find(x => x.id === pupil.class_id)) {
                is_assigned_subject = true;
            }

            if(is_assigned_subject) {
                response.push({
                    subject_id: subject.id,
                    subject_name: subject.name,
                    teacher_name: `${subject.teacher.forename} ${subject.teacher.surname}`,
                    pupil_name: `${pupil.forename} ${pupil.surname}`,
                    grade: Number.parseFloat(subject.tests && subject.tests.length ? test_results_sum / subject.tests.length : 0).toFixed(2)
                });
            }
        });

        if(!response.length) return res.status(400).send("No data found.");

        const data = [];

        response.forEach(function(subject) {
            data.push({
                "Subject Name": subject.subject_name,
                "Teacher Name": subject.teacher_name,
                "Pupil ID": pupil.id,
                "Pupil Name": `${pupil.forename} ${pupil.surname}`,
                Grade: subject.grade
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("subjects-overview.csv");
        res.send(csv);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

exports.login = login;
exports.logout = logout;
exports.getUserProfile = getUserProfile;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.changePassword = changePassword;
exports.getAssignedSubjects = getAssignedSubjects;
exports.getPupilSubject = getPupilSubject;
exports.getPupilSubjects = getPupilSubjects;
exports.exportData = exportData;
exports.exportAssignedSubjects = exportAssignedSubjects;
exports.exportPupilSubjects = exportPupilSubjects;
