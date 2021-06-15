const { Op } = require("sequelize");

const User = require("./user.model");
const Program = require("../class/class.model");
const Subject = require("../subject/subject.model");
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
        const query = {
            id: { [Op.ne]: req.user.id }
        };

        if(req.query.role) {
            query.role = req.query.role;
        }

        const users = await User.findAll({
            where: query,
            attributes: { exclude: ["password", "refresh_token"] },
            order: [
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
        const { forename, surename, username, password } = req.body;

        await User.update({
            forename,
            surename,
            username,
            password,
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

        //await User.destroy({ where: { id: req.params.id }});
        //res.json({ id: req.params.id });
        res.json(user);
    } catch(err) {
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

exports.login = login;
exports.logout = logout;
exports.getUserProfile = getUserProfile;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getAssignedSubjects = getAssignedSubjects;
