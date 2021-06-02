module.exports = {
    frontend: {
        css: "wwwroot/bundles/app.css",
        js: "wwwroot/bundles/app.js"
    },
    backend: {
        routes: [
            "src/backend/!(core)/**/*.routes.js",
            "src/backend/core/**/*.routes.js"
        ],
        strategies: ["src/backend/**/*.strategy.js"]
    }
};
