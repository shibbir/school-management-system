module.exports = {
    frontend: {
        css: "wwwroot/bundles/app.css",
        js: "wwwroot/bundles/app.js"
    },
    backend: {
        routes: [
            "src/backend/user/user.routes.js",
            "src/backend/class/class.routes.js",
            "src/backend/subject/subject.routes.js",
            "src/backend/core/index.routes.js"
        ],
        strategies: ["src/backend/**/*.strategy.js"]
    }
};
