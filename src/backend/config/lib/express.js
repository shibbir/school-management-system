const _ = require("lodash");
const path = require("path");
const glob = require("glob");
const express = require("express");
const hbs = require("express-hbs");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const defaultAssets = require(path.join(process.cwd(), "src/backend/config/assets/default"));
const environmentAssets = process.env.NODE_ENV === "production" ? require(path.join(process.cwd(), "src/backend/config/assets/production")) : {};
const assets = _.merge(defaultAssets, environmentAssets);

module.exports = function() {
    const app = express();

    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(process.cwd(), "wwwroot")));

    app.engine("html", hbs.express4({ extname: ".html" }));
    app.set("view engine", "html");
    app.set("views", path.join(process.cwd(), "src/backend/core"));

    app.set("port", process.env.PORT);

    app.locals.jsFiles = glob.sync(assets.frontend.js).map(filePath => filePath.replace("wwwroot/", ""));
    app.locals.cssFiles = glob.sync(assets.frontend.css).map(filePath => filePath.replace("wwwroot/", ""));

    assets.backend.routes.forEach(function(pattern) {
        require(path.resolve(glob.sync(pattern)[0]))(app);
    });

    assets.backend.strategies.forEach(function(pattern) {
        require(path.resolve(glob.sync(pattern)[0]))();
    });

    return app;
};
