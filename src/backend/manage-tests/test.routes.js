const controller = require("./test.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { testSchema, testIdSchema, subjectIdSchema } = require("./test.schema");

module.exports = function(app) {
    app.route("/api/subjects/:id/tests")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(subjectIdSchema),
            controller.getTests
        )
        .post(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(subjectIdSchema),
            validateBody(testSchema),
            controller.createTest
        );

    app.route("/api/tests/:id")
        .get(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            controller.getTest
        )
        .patch(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            controller.updateTest
        )
        .delete(
            authenticate,
            authorizeFor(["teacher"]),
            validateParams(testIdSchema),
            controller.deleteTest
        );
};
