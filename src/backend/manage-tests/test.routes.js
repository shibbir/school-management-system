const controller = require("./test.controller");
const { authenticate } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { testSchema, testIdSchema, subjectIdSchema } = require("./test.schema");

module.exports = function(app) {
    app.route("/api/subjects/:id/tests")
        .get(authenticate, validateParams(subjectIdSchema), controller.getTests)
        .post(authenticate, validateParams(subjectIdSchema), validateBody(testSchema), controller.createTest);

    app.route("/api/tests/:id")
        .get(authenticate, validateParams(testIdSchema), controller.getTest)
        .patch(authenticate, validateParams(testIdSchema), controller.updateTest)
        .delete(authenticate, validateParams(testIdSchema), controller.deleteTest);
};
