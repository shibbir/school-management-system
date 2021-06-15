const multer = require("../config/lib/multer");
const controller = require("./test-result.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.route("/api/tests/:id/results")
        .get(authenticate, controller.getTestResults)
        .post(authenticate, controller.createTestResult);

    app.route("/api/test-results/:id")
        .get(authenticate, controller.getTestResult)
        .patch(authenticate, controller.updateTestResult)
        .delete(authenticate, controller.deleteTestResult);

    app.route("/api/tests/:id/import-results")
        .post(authenticate, multer.single("result"), controller.importTestResults);
};
