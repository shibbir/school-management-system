const multer = require("../config/lib/multer");
const controller = require("./test-result.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { testResultSchema, testResultUpdateSchema, testIdSchema, testResultIdSchema } = require("./test-result.schema");

module.exports = function(app) {
    app.route("/api/tests/:id/results")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            controller.getTestResults
        )
        .post(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            validateBody(testResultSchema),
            controller.createTestResult
        );

    app.route("/api/test-results/:id")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testResultIdSchema),
            controller.getTestResult
        )
        .patch(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testResultIdSchema),
            validateBody(testResultUpdateSchema),
            controller.updateTestResult
        )
        .delete(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testResultIdSchema),
            controller.deleteTestResult
        );

    app.route("/api/tests/:id/import-results")
        .post(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            multer.single("result"),
            controller.importTestResults
        );

    app.route("/api/tests/:id/download-sample-batch-grade-file")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            controller.downloadSampleBatchGradeFile
        );
};
