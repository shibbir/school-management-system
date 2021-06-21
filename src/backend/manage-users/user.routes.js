const controller = require("./user.controller");
const { authenticate, authorizeFor } = require("../core/security.middleware");

module.exports = function(app) {
    app.post("/api/login", controller.login);

    app.get("/api/logout", authenticate, controller.logout);

    app.get("/api/profile", authenticate, controller.getUserProfile);

    app.patch("/api/profile/change-password", authenticate, controller.changePassword);

    app.route("/api/users")
        .get(authenticate, authorizeFor(["admin", "teacher"]), controller.getUsers)
        .post(authenticate, authorizeFor(["admin"]), controller.createUser);

    app.route("/api/users/:id")
        .get(authenticate, controller.getUser)
        .patch(authenticate, controller.updateUser)
        .delete(authenticate, authorizeFor(["admin"]), controller.deleteUser);

    app.route("/api/teachers/:id/subjects")
        .get(authenticate, authorizeFor(["teacher"]), controller.getAssignedSubjects);

    app.route("/api/pupils/:id/subjects")
        .get(authenticate, authorizeFor(["pupil"]), controller.getPupilSubjects);

    app.route("/api/pupils/:pupil_id/subjects/:subject_id")
        .get(authenticate, authorizeFor(["pupil"]), controller.getPupilSubject)
};
