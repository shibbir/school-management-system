const multer = require("../config/lib/multer");
const controller = require("./test.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/subjects/:id/tests")
        .get(authenticate, controller.getTests)
        .post(authenticate, controller.createTest);

    app.route("/api/tests/:id")
        .get(authenticate, controller.getTest)
        .patch(authenticate, controller.updateTest);

    app.route("/api/tests/:id/results")
        .get(authenticate, controller.getTestResults)
        .post(authenticate, multer.single("result"), controller.uploadTestResults);
};
