const controller = require("./subject.controller");
const { authenticate } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { subjectSchema, classIdSchema, subjectIdSchema } = require("./subject.schema");

module.exports = function(app) {
    app.route("/api/subjects/:id")
        .get(authenticate, validateParams(subjectIdSchema), controller.getSubject)
        .patch(authenticate, validateParams(subjectIdSchema), controller.updateSubject)
        .delete(authenticate, validateParams(subjectIdSchema), controller.deleteSubject);

    app.route("/api/subjects/:id/pupil-grades")
        .get(authenticate, validateParams(subjectIdSchema), controller.getPupilGrades);

    app.route("/api/classes/:id/subjects")
        .get(authenticate, validateParams(classIdSchema), controller.getSubjectsByClass)
        .post(authenticate, validateParams(classIdSchema), validateBody(subjectSchema), controller.addSubject);
};
