const controller = require("./user.controller");
const { authenticate } = require("../core/security.middleware");

module.exports = function(app) {
    app.post("/api/login", controller.login);

    app.get("/api/profile", authenticate, controller.getUserProfile);
};
