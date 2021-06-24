const { Op } = require("sequelize");
const { Parser } = require("json2csv");

const Program = require("./class.model");
const User = require("../manage-users/user.model");
const Subject = require("../manage-subjects/subject.model");
const { archiveOrDeleteSubjects } = require("../manage-subjects/subject.controller");

async function getClasess(req, res, next) {
    try {
        const classes = await Program.findAll({
            include: [
                {
                    model: User,
                    as: "pupils",
                    attributes: ["id"]
                },
                {
                    model: Subject,
                    as: "subjects",
                    attributes: ["id"]
                }
            ],
            attributes: {exclude: ["created_by", "updated_by"]},
            order: [
                ["created_at", "DESC"]
            ]
        });

        res.json(classes);
    } catch(err) {
        next(err);
    }
}

async function createClass(req, res, next) {
    try {
        const { name } = req.body;

        const matched_name = await Program.count({ where: {
            name
        }});

        if(matched_name) return res.status(400).send("Name already exists. Please try with a different one.");

        const program = await Program.create({
            name,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        res.json(program);

    } catch(err) {
        next(err);
    }
}

async function getClass(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.id);

        res.json(program);
    } catch(err) {
        next(err);
    }
}

async function updateClass(req, res, next) {
    try {
        let program = await Program.findByPk(req.params.id);

        program = await program.update({
            name: req.body.name,
            updated_by: req.user.id
        }, { returning: true });

        res.json(program);
    } catch(err) {
        next(err);
    }
}

async function deleteClass(req, res, next) {
    try {
        await User.update({
            class_id: null,
            updated_by: req.user.id
        }, { where: {
            class_id: req.params.id
        }});

        await archiveOrDeleteSubjects(req.params.id, req.user.id);

        await Program.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });

    } catch(err) {
        next(err);
    }
}

async function bulkEnrolment(req, res, next) {
    try {
        const class_id = req.params.id;

        const program = await Program.findByPk(class_id);

        if(!program) return res.status(404).send("Class not found.");

        let pupils = await User.findAll({
            where: {
                [Op.or]: {
                    class_id,
                    id: {
                        [Op.in]: req.body.pupils
                    }
                }
            },
            raw : true
        });

        pupils = pupils.map(pupil => {
            if(req.body.pupils.includes(pupil.id)) {
                pupil.class_id = class_id;
            } else {
                pupil.class_id = null;
            }

            pupil.updated_by = req.user.id;

            return pupil;
        });

        await User.bulkCreate(pupils, { updateOnDuplicate: ["class_id", "updated_by", "updated_at"] });

        res.sendStatus(204);
    } catch(err) {
        next(err);
    }
}

async function exportData(req, res, next) {
    try {
        const classes = await Program.findAll({
            attributes: ["id", "name", "created_at", "updated_at"],
            order: [
                ["name"]
            ],
            raw: true
        });

        if(!classes.length) return res.status(400).send("No data found.");

        const data = [];

        classes.forEach(function(program) {
            data.push({
                "Class ID": program.id,
                Name: program.name,
                "Created At": new Date(program.created_at).toLocaleDateString("en-US"),
                "Updated At": new Date(program.updated_at).toLocaleDateString("en-US")
            });
        });

        const json2csvParser = new Parser({ quote: "" });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("classes.csv");
        res.send(csv);
    } catch(err) {
        next(err);
    }
}

exports.getClasess = getClasess;
exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;
exports.bulkEnrolment = bulkEnrolment;
exports.exportData = exportData;
