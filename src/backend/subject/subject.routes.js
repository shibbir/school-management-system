const controller = require("./subject.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/subjects")
        .get(authenticate, controller.getSubjects)
        .post(authenticate, controller.createSubject);
};
