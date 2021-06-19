const controller = require("./class.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/classes")
        .get(authenticate, controller.getClasess)
        .post(authenticate, controller.createClass);

    app.route("/api/classes/:id")
        .get(authenticate, controller.getClass)
        .patch(authenticate, controller.updateClass)
        .delete(authenticate, controller.deleteClass);

    app.route("/api/classes/:id/pupils")
        .patch(authenticate, controller.bulkEnrolment);
};
