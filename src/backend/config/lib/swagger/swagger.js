const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Schools Management System APIs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/backend/config/lib/swagger/*.swagger.yaml"]
};

const specs = swaggerJsdoc(options);

exports.specs = specs;
