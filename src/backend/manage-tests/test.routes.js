const controller = require("./test.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/subjects/:id/tests")
        .get(authenticate, controller.getTests)
        .post(authenticate, controller.createTest);

    app.route("/api/tests/:id")
        .get(authenticate, controller.getTest)
        .patch(authenticate, controller.updateTest)
        .delete(authenticate, controller.deleteTest);
};
