const { Op } = require("sequelize");
const { Parser } = require("json2csv");

const Program = require("./class.model");
const User = require("../manage-users/user.model");
const Subject = require("../manage-subjects/subject.model");
const { archiveOrDeleteSubjects } = require("../manage-subjects/subject.controller");

async function getClasess(req, res) {
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
                    attributes: ["id"],
                    through: { attributes: [] }
                }
            ],
            order: [
                ["created_at", "DESC"]
            ]
        });

        res.json(classes);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function createClass(req, res) {
    try {
        const { name } = req.body;

        const matched_name = await Program.count({ where: {
            name
        }});

        if(matched_name) return res.status(400).send("Name already exists. Please try with a different one.");

        const program = await Program.create({ name });

        res.json(program);

    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function getClass(req, res) {
    try {
        const program = await Program.findByPk(req.params.id, {
            attributes: ["id", "name"]
        });

        res.json(program);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function updateClass(req, res) {
    try {
        const { name } = req.body;

        let program = await Program.findByPk(req.params.id);

        const matched_name = await Program.count({ where: {
            name: { [Op.iLike]: name },
            id: { [Op.ne]: req.params.id }
        }});

        if(matched_name) {
            return res.status(400).send("Class name already exists. Please try with a different name.");
        }

        program = await program.update({ name }, { returning: true });

        res.json(program);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function deleteClass(req, res) {
    try {
        await User.update({
            class_id: null
        }, { where: {
            class_id: req.params.id
        }});

        await archiveOrDeleteSubjects(req.params.id);

        await Program.destroy({ where: { id: req.params.id }});

        res.json({ id: req.params.id });

    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function bulkEnrolment(req, res) {
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

            return pupil;
        });

        await User.bulkCreate(pupils, { updateOnDuplicate: ["class_id", "updated_at"] });

        res.sendStatus(204);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function bulkSubjectsSelection(req, res) {
    try {
        const program = await Program.findByPk(req.params.id);

        if(!program) return res.status(404).send("Class not found.");

        const all_subjects = await Subject.findAll();

        const subjects = await Subject.findAll({ where: { id: {
            [Op.in]: req.body.subjects
        }}});

        await program.removeSubjects(all_subjects);
        await program.addSubjects(subjects);

        res.sendStatus(204);
    } catch(err) {
        res.status(500).send("An error occurred. Please try again.");
    }
}

async function exportData(req, res) {
    try {
        const classes = await Program.findAll({
            attributes: ["name", "created_at", "updated_at"],
            order: [
                ["name"]
            ],
            raw: true
        });

        if(!classes.length) return res.status(400).send("No data found.");

        const data = [];

        classes.forEach(function(program) {
            data.push({
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
        res.status(500).send("An error occurred. Please try again.");
    }
}

exports.getClasess = getClasess;
exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
exports.deleteClass = deleteClass;
exports.bulkEnrolment = bulkEnrolment;
exports.bulkSubjectsSelection = bulkSubjectsSelection;
exports.exportData = exportData;
