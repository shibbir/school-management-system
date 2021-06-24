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

async function login(req, res, next) {
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
        next(err);
    }
}

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").redirect("/");
}

async function getUserProfile(req, res) {
    res.json(formatUserProfile(req.user));
}

async function getUser(req, res, next) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "refresh_token", "created_by", "updated_by", "created_at"] },
        });

        res.json(formatUserProfile(user));
    } catch(err) {
        next(err);
    }
}

async function getUsers(req, res, next) {
    try {
        const query = {};

        if(req.query.role) {
            query.role = req.query.role;
        }

        if(req.query.class_id) {
            query.class_id = req.query.class_id;
        }

        const users = await User.findAll({
            where: query,
            attributes: { exclude: ["password", "refresh_token", "created_by", "updated_by", "created_at"] },
            order: [
                ["role"],
                ["forename"]
            ],
            include: [
                {
                    model: Program,
                    as: "class",
                    attributes: ["name"]
                },
                {
                    model: User,
                    as: "modifier",
                    attributes: ["forename", "surname"]
                }
            ]
        });

        res.json(users);
    } catch(err) {
        next(err);
    }
}

async function createUser(req, res, next) {
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
            password,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        const user = await User.findByPk(entity.id, {
            attributes: { exclude: ["password", "refresh_token"] },
            include: [{
                model: User,
                as: "modifier",
                attributes: ["forename", "surname"]
            }]
        });

        res.json({ ...formatUserProfile(user), modifier: user.modifier });
    } catch(err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const { username, forename, surename } = req.body;

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
            username: username.toLowerCase(),
            id: { [Op.ne]: req.user.id }
        }});

        if(matched_username) {
            return res.status(400).send("Username already exists. Please try with a different one.");
        }

        await User.update({
            forename,
            surename,
            username,
            updated_by: req.user.id
        }, { where: { id: req.params.id }});

        const user = await User.findByPk(req.params.id, {
            attributes: ["id", "forename", "surname", "username", "role"],
            include: [{
                model: User,
                as: "modifier",
                attributes: ["forename", "surname"]
            }]
        });

        res.json(user);
    } catch(err) {
        next(err);
    }
}

async function deleteUser(req, res, next) {
    try {
        if(req.params.id === req.user.id) return res.status(400).send("You cannot remove yourself.");

        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Subject,
                as: "subjects"
            }]
        });

        if(user.role === "teacher") {
            if(user.subjects.find(x => x.status === "active")) {
                res.status(400).send("Teachers cannot be removed while they are assigned to at least one non-archived subject.");
            }
        }

        await User.destroy({ where: { id: req.params.id }});
        res.json({ id: req.params.id });
    } catch(err) {
        next(err);
    }
}

async function changePassword(req, res, next) {
    try {
        const { current_password, new_password } = req.body;

        const user = await User.findByPk(req.user.id);

        if (!user || !user.validPassword(current_password)) return res.status(400).send("Current password is incorrect.");

        user.password = new_password;
        user.updated_by = req.user.id;

        await user.save();

        res.status(204).send("Password updated successfully.");
    } catch (err) {
        next(err);
    }
}

async function getAssignedSubjects(req, res, next) {
    try {
        const subjects = await Subject.findAll({
            where: { teacher_id: req.user.id },
            order: [
                ["created_at", "DESC"]
            ],
            include: {
                model: Program,
                as: "class",
                attributes: ["name"]
            },
            attributes: ["id", "name", "status", "updated_at"]
        });

        res.json(subjects);
    } catch(err) {
        next(err);
    }
}

async function getPupilSubjects(req, res, next) {
    try {
        const pupil = await User.findByPk(req.params.id, {
            attributes: ["class_id"]
        });

        const subjects = await Subject.findAll({
            attributes: ["id", "name", "class_id"],
            include: [
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
                        attributes: ["pupil_id", "grade"],
                        where: { pupil_id: req.params.id }
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
                    test_results_sum += +test.test_results[0].grade;
                    is_assigned_subject = true;
                }
            });

            if(pupil.class_id && pupil.class_id === subject.class_id) {
                is_assigned_subject = true;
            }

            if(is_assigned_subject) {
                response.push({
                    subject_id: subject.id,
                    subject_name: subject.name,
                    teacher_name: `${subject.teacher.forename} ${subject.teacher.surname}`,
                    grade: subject.tests && subject.tests.length ? test_results_sum / subject.tests.length : 0
                });
            }
        });

        res.json(response);
    } catch(err) {
        next(err);
    }
}

async function getPupilSubject(req, res, next) {
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
                    attributes: ["pupil_id", "grade"],
                    where: { pupil_id: req.params.pupil_id }
                }
            }
        });

        res.json(subject);
    } catch(err) {
        next(err);
    }
}

async function exportData(req, res, next) {
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
        next(err);
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
