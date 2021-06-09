const controller = require("./class.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/classes")
        .get(authenticate, controller.getClasess)
        .post(authenticate, controller.createClass);

    app.route("/api/classes/:id")
        .get(authenticate, controller.getClass)
        .put(authenticate, controller.updateClass);

    app.route("/api/classes/:id/subjects")
        .get(authenticate, controller.getSubjects)
        .post(authenticate, controller.addSubject);

    app.route("/api/classes/:class_id/subjects/:subject_id")
        .get(authenticate, controller.getSubject)
        .put(authenticate, controller.updateSubject)
        .delete(authenticate, controller.deleteSubject);
};
