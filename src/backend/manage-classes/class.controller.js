const { Op } = require("sequelize");

const Program = require("./class.model");
const User = require("../manage-users/user.model");
const Subject = require("../manage-subjects/subject.model");

async function getClasess(req, res, next) {
    try {
        const classes = await Program.findAll({
            include: [
                {
                    model: User,
                    as: "pupils",
                    attributes: ["forename", "surname"]
                },
                {
                    model: Subject,
                    as: "subjects",
                    attributes: ["id", "name"]
                }
            ],
            order: [
                ["updated_at", "DESC"]
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

        let = await program.update({
            name: req.body.name,
            updated_by: req.user.id
        }, { returning: true });

        res.json(program);
    } catch(err) {
        next(err);
    }
}

async function bulkEnrolment(req, res, next) {
    try {
        const program = await Program.findByPk(req.params.id);

        if(!program) return res.status(404).send("Class not found.");

        let pupils = await User.findAll({
            where: {
                [Op.or]: {
                    class_id: req.params.id,
                    id: {
                        [Op.in]: req.body.pupils
                    }
                }
            },
            raw : true
        });

        pupils = pupils.map(pupil => {
            if(req.body.pupils.includes(pupil.id)) {
                pupil.class_id = req.params.id;
            } else {
                pupil.class_id = null;
            }

            pupil.updated_by = req.user.id;

            return pupil;
        });

        await User.bulkCreate(pupils, { updateOnDuplicate: ["class_id", "updated_by", "updated_at"] });

        res.sendStatus(200);
    } catch(err) {
        next(err);
    }
}

exports.getClasess = getClasess;
exports.createClass = createClass;
exports.getClass = getClass;
exports.updateClass = updateClass;
exports.bulkEnrolment = bulkEnrolment;
