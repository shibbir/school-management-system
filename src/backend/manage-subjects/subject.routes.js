const controller = require("./subject.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { subjectSchema, classIdSchema, subjectIdSchema } = require("./subject.schema");

module.exports = function(app) {
    app.route("/api/subjects")
        .get(
            authenticate,
            authorizeFor(["admin"]),
            controller.getSubjects
        ).post(
            authenticate,
            authorizeFor(["admin"]),
            validateBody(subjectSchema),
            controller.addSubject
        );

    app.route("/api/subjects/export")
        .get(
            authenticate,
            authorizeFor(["admin"]),
            controller.exportData
        );

    app.route("/api/subjects/:id")
        .get(
            authenticate,
            validateParams(subjectIdSchema),
            controller.getSubject
        )
        .patch(
            authenticate,
            authorizeFor(["admin"]),
            validateParams(subjectIdSchema),
            controller.updateSubject
        )
        .delete(
            authenticate,
            authorizeFor(["admin"]),
            validateParams(subjectIdSchema),
            controller.deleteSubject
        );

    app.route("/api/subjects/:id/pupil-grades")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(subjectIdSchema),
            controller.getPupilGrades
        );

    // app.route("/api/classes/:id/subjects")
    //     .get(
    //         authenticate,
    //         authorizeFor(["admin"]),
    //         validateParams(classIdSchema),
    //         controller.getSubjectsByClass
    //     )
    //     .post(
    //         authenticate,
    //         authorizeFor(["admin"]),
    //         validateParams(classIdSchema),
    //         validateBody(subjectSchema),
    //         controller.addSubject
    //     );

};
