const controller = require("./subject.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/classes/:id/subjects")
        .get(authenticate, controller.getSubjects)
        .post(authenticate, controller.addSubject);

    app.route("/api/subjects/:id")
        .get(authenticate, controller.getSubject)
        .patch(authenticate, controller.updateSubject)
        .delete(authenticate, controller.deleteSubject);
};
