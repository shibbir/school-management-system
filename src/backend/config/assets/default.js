module.exports = {
    frontend: {
        css: "wwwroot/bundles/app.css",
        js: "wwwroot/bundles/app.js"
    },
    backend: {
        routes: [
            "src/backend/manage-users/user.routes.js",
            "src/backend/manage-classes/class.routes.js",
            "src/backend/manage-subjects/subject.routes.js",
            "src/backend/manage-tests/test.routes.js",
            "src/backend/manage-test-results/test-result.routes.js",
            "src/backend/core/index.routes.js"
        ],
        strategies: ["src/backend/**/*.strategy.js"]
    }
};
