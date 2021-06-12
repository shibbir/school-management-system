const controller = require("./user.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.post("/api/login", controller.login);

    app.get("/api/logout", authenticate, controller.logout);

    app.get("/api/profile", authenticate, controller.getUserProfile);

    app.route("/api/users")
        .get(authenticate, controller.getUsers)
        .post(authenticate, controller.createUser);

    app.route("/api/users/:id")
        .get(authenticate, controller.getUser)
        .patch(authenticate, controller.updateUser)
        .delete(authenticate, controller.deleteUser);
};
