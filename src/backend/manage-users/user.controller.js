const { Op } = require("sequelize");

const User = require("./user.model");
const Program = require("../manage-classes/class.model");
const Subject = require("../manage-subjects/subject.model");
const { generateAccessToken, generateRefreshToken } = require("../core/security.middleware");

function formatUserProfile(user) {
    const profile = {
        id: user.id,
        username: user.username,
        forename: user.forename,
        surname: user.surname,
        role: user.role,
        modifier: user.modifier
    };

    return profile;
}

async function login(req, res, next) {
    try {
        let user;
        const { username, password, grant_type } = req.body;

        if(!grant_type) return res.status(401).send("Invalid credentials.");

        if(grant_type === "password") {
            user = await User.findOne({ where: {
                username: {
                    [Op.iLike]: username
                }
            }});

            if(!user || !user.validPassword(password)) {
                return res.status(401).send("Invalid credentials.");
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
            attributes: { exclude: ["password", "refresh_token"] },
        });

        res.json(user);
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
            attributes: { exclude: ["password", "refresh_token"] },
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

        res.json(formatUserProfile(user));
    } catch(err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const { username, forename, surename } = req.body;

        if(req.user.role !== "admin" && req.user.id !== req.params.id) {
            return res.status(403).send("You don't have the permission.");
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
            attributes: { exclude: ["password", "refresh_token"] },
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
        const { current_password, new_password, confirm_new_password } = req.body;

        const user = await User.findByPk(req.user.id);

        if (!user || !user.validPassword(current_password)) return res.status(400).send("Current password is incorrect.");

        if(new_password !== confirm_new_password) return res.status(400).send("New password and confirm password does not match.");

        user.password = new_password;
        user.updated_by = req.user.id;

        await user.save();

        res.status(200).send("Password changed successfully.");
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
                attributes: ["id", "name"]
            }
        });

        res.json(subjects);
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
