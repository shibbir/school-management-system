const axios = require("axios");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("./user.model");
const { generateAccessToken, generateRefreshToken } = require("../core/security.middleware");

function formatUserProfile(user) {
    const profile = {
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
            doc = await User.findOne({ email: username });

            if(!doc || !doc.validPassword(password)) {
                return res.status(401).send("Invalid credentials.");
            }

            doc.refresh_token = generateRefreshToken(doc);
            await doc.save();
        }

        res.cookie("access_token", generateAccessToken(doc), { httpOnly: true, sameSite: true });
        res.cookie("refresh_token", doc.refresh_token, { httpOnly: true, sameSite: true });

        res.json(formatUserProfile(doc));
    } catch (err) {
        res.sendStatus(500);
    }
}

async function getUserProfile(req, res) {
    res.json(formatUserProfile(req.user));
}

exports.login = login;
exports.getUserProfile = getUserProfile;
