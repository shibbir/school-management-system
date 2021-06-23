const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "School Management System APIs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: [
        "./src/backend/config/lib/swagger/user.swagger.yaml",
        "./src/backend/config/lib/swagger/class.swagger.yaml",
        "./src/backend/config/lib/swagger/subject.swagger.yaml",
        "./src/backend/config/lib/swagger/test.swagger.yaml",
        "./src/backend/config/lib/swagger/test-result.swagger.yaml"
    ]
};

const specs = swaggerJsdoc(options);

exports.specs = specs;
