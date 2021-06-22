function validateBody(schema) {
    return function (req, res, next) {
        schema.validate(req.body, { abortEarly: false }).then(function() {
            next();
        }).catch(function (err) {
            return res.status(400).send(err.inner[0].message);
        });
    }
}

function validateParams(schema) {
    return function (req, res, next) {
        schema.validate(req.params, { abortEarly: false }).then(function() {
            next();
        }).catch(function (err) {
            return res.status(400).send(err.inner[0].message);
        });
    }
}

exports.validateBody = validateBody;
exports.validateParams = validateParams;
