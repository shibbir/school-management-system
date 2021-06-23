const controller = require("./class.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { classSchema, idSchema } = require("./class.schema");

module.exports = function(app) {
    app.route("/api/classes")
        .get(authenticate, controller.getClasess)
        .post(authenticate, authorizeFor(["admin"]), validateBody(classSchema), controller.createClass);

    app.route("/api/classes/:id")
        .get(authenticate, validateParams(idSchema), controller.getClass)
        .patch(authenticate, authorizeFor(["admin"]), validateParams(idSchema), controller.updateClass)
        .delete(authenticate, authorizeFor(["admin"]), validateParams(idSchema), controller.deleteClass);

    app.route("/api/classes/:id/bulk-enrolment")
        .patch(authenticate, authorizeFor(["admin"]), validateParams(idSchema), controller.bulkEnrolment);
};
