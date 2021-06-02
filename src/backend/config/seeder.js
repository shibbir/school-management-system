const path = require("path");
const async = require("async");
const mongoose = require(path.join(process.cwd(), "src/config/mongoose"));
const User = require(path.join(process.cwd(), "src/user/user.model"));

const userSeeder = function(callback) {
    const user = new User();

    user.role = "admin";
    user.forename = "John";
    user.surname = "Doe";
    user.email = "john.doe@sms.com";
    user.password = user.generateHash("P@ssword123");

    user.save(function(err, doc) {
        if(err) return callback(err);
        callback(null, doc);
    });
};

require("dotenv").config();

mongoose.connect(function() {
    async.waterfall([ userSeeder ], function(err) {
        if(err) console.error(err);
        else console.info("DB seed completed!");
        process.exit();
    });
});
