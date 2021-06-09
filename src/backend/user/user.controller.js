const mongoose = require("mongoose");
const User = require("./user.model");
const { generateAccessToken, generateRefreshToken } = require("../core/security.middleware");

function formatUserProfile(user) {
    const profile = {
        _id: user._id,
        email: user.email,
        forename: user.forename,
        surname: user.surname,
        role: user.role
    };

    return profile;
}

async function login(req, res) {
    try {
        let doc;
        const { username, password, grant_type } = req.body;

        if(!grant_type) return res.status(401).send("Invalid credentials.");

        if(grant_type === "password") {
            doc = await User.findOne({ username });

            if(!doc || !doc.validPassword(password)) {
                return res.status(401).send("Invalid credentials.");
            }

            doc.refresh_token = generateRefreshToken(doc);
            await doc.save();
        }

        res.cookie("access_token", generateAccessToken(doc), { httpOnly: true, sameSite: true, signed: true });
        res.cookie("refresh_token", doc.refresh_token, { httpOnly: true, sameSite: true, signed: true });

        res.json(formatUserProfile(doc));
    } catch (err) {
        res.sendStatus(500);
    }
}

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").redirect("/");
}

async function getUserProfile(req, res) {
    res.json(formatUserProfile(req.user));
}

async function getUser(req, res) {
    try {
        const doc = await User.findOne({ _id: req.params.id }).select("-password");

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function getUsers(req, res) {
    try {
        const query = {
            _id: { $ne: req.user.id }
        };

        if(req.query.role) {
            query.role = req.query.role;
        }

        const docs = await User.find(query).select("-password").sort("name");

        res.json(docs);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function createUser(req, res) {
    try {
        const { username, password, forename, surname, role } = req.body;
        const user = new User();

        user._id = new mongoose.Types.ObjectId();
        user.username = username;
        user.role = role;
        user.forename = forename;
        user.surname = surname;
        user.password = user.generateHash(password);
        user.refresh_token = generateRefreshToken(user);

        await user.save();

        res.json(formatUserProfile(user));
    } catch(err) {
        res.sendStatus(500);
    }
}

async function updateUser(req, res) {
    try {
        const doc = await User.findOne({ _id: req.params.id });

        const { forename, surename, username, password } = req.body;

        doc.forename = forename;
        doc.surename = surename;
        doc.username = username;
        doc.password = doc.generateHash(password);
        doc.refresh_token = generateRefreshToken(doc);

        doc = await doc.save();

        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
    }
}

async function deleteUser(req, res) {
    try {
        const doc = await User.findOneAndRemove({ _id: req.params.id }).select("-password");
        res.json(doc);
    } catch(err) {
        res.sendStatus(500);
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
