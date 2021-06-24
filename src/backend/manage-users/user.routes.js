const controller = require("./user.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");
const { validateBody, validateParams } = require("../core/validator.middleware");
const { loginSchema, registrationSchema, idSchema, changePasswordSchema } = require("./user.schema");

module.exports = function(app) {
    app.post("/api/login", validateBody(loginSchema), controller.login);

    app.get("/api/logout", authenticate, controller.logout);

    app.get("/api/profile", authenticate, controller.getUserProfile);

    app.patch("/api/profile/change-password", authenticate, validateBody(changePasswordSchema), controller.changePassword);

    app.route("/api/users")
        .get(authenticate, authorizeFor(["admin", "teacher"]), controller.getUsers)
        .post(authenticate, authorizeFor(["admin"]), validateBody(registrationSchema), controller.createUser);

    app.route("/api/users/export")
        .get(authenticate, authorizeFor(["admin"]), controller.exportData);

    app.route("/api/users/:id")
        .get(authenticate, validateParams(idSchema), controller.getUser)
        .patch(authenticate, validateParams(idSchema), controller.updateUser)
        .delete(authenticate, authorizeFor(["admin"], validateParams(idSchema)), controller.deleteUser);

    app.route("/api/teachers/:id/subjects")
        .get(authenticate, authorizeFor(["teacher"]), controller.getAssignedSubjects);

    app.route("/api/pupils/:id/subjects")
        .get(authenticate, authorizeFor(["pupil"]), controller.getPupilSubjects);

    app.route("/api/pupils/:pupil_id/subjects/:subject_id")
        .get(authenticate, authorizeFor(["pupil"]), controller.getPupilSubject)
};
