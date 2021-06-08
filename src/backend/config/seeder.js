const path = require("path");
const async = require("async");
const faker = require("faker");
const bcrypt = require("bcryptjs");
const User = require(path.join(process.cwd(), "src/backend/user/user.model"));
const Subject = require(path.join(process.cwd(), "src/backend/subject/subject.model"));
const ClassModel = require(path.join(process.cwd(), "src/backend/class/class.model"));
const mongoose = require(path.join(process.cwd(), "src/backend/config/lib/mongoose"));

const userSeeder = function(callback) {
    const users = [
        {
            role: "admin",
            _id: "60bf0acdafa44f7eb1a0e3f6",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: "admin@sms.com",
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "teacher",
            _id: "60be9b85e8e85fd545ff9758",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("one").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "teacher",
            _id: "60be9b9d04e9a06e759e6a01",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("two").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "teacher",
            _id: "60be9ba2f21a5ee048a9002a",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("three").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be94812f94bc3039743d61",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("four").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be95bc34cd3db384d49ebb",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("five").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be95d00e1b52e1aefc4867",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("six").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be95eef482d4ae53bac2a2",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("seven").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be95fba9cbf1ab7efa144d",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("eight").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be960a4c8d888978b8b333",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("ten").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be961836091c0a99cac84f",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("eleven").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            _id: "60be96765b7c532a697b8243",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("twelve").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        },
        {
            role: "pupil",
            forename: faker.name.firstName(),
            surname: faker.name.lastName(),
            username: faker.internet.email("thirteen").toLowerCase(),
            password: bcrypt.hashSync("P@ssw0rd", 8)
        }
    ];

    User.insertMany(users, function(err) {
        if(err) return callback(err);
        callback();
    });
};

const subjectSeeder = function(callback) {
    const subjects = [
        {
            _id: "60be9ab37068bb28288f8366",
            name: "Automotive Sensor Systems",
            teacher: "60be9b9d04e9a06e759e6a01",
            tests: [
                { name: "Automotive Sensor Systems: First Test" },
                { name: "Automotive Sensor Systems: Second Test" },
                { name: "Automotive Sensor Systems: Third Test" }
            ],
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },
        {
            _id: "60be9ac948411ffd676802d6",
            name: "Design of Software for Embedded Systems",
            teacher: "60be9b9d04e9a06e759e6a01",
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },
        {
            _id: "60be9ace72ca109a81ee6118",
            name: "Formal Specification and Verification",
            teacher: "60be9ba2f21a5ee048a9002a",
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },

        {
            _id: "60be9ad24e0446cd6473a4f6",
            name: "Databases and Web Techniques",
            teacher: "60be9b9d04e9a06e759e6a01",
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },
        {
            _id: "60be9ad6a4e478053d3a980c",
            name: "Data Security and Cryptography",
            teacher: "60be9ba2f21a5ee048a9002a",
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },
        {
            _id: "60be9ad9b7ca52aa44d71381",
            name: "Distributed Software Security",
            teacher: "60be9ba2f21a5ee048a9002a",
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        }
    ];

    Subject.insertMany(subjects, function(err) {
        if(err) return callback(err);
        callback();
    });
};

const classSeeder = function(callback) {
    const classes = [
        {
            name: "Automotive Software Engineering",
            subjects: ["60be9ab37068bb28288f8366", "60be9ac948411ffd676802d6", "60be9ace72ca109a81ee6118"],
            pupils: ["60be94812f94bc3039743d61", "60be95bc34cd3db384d49ebb", "60be95d00e1b52e1aefc4867", "60be95eef482d4ae53bac2a2"],
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        },
        {
            name: "Web Engineering",
            subjects: ["60be9ad24e0446cd6473a4f6", "60be9ad6a4e478053d3a980c", "60be9ad9b7ca52aa44d71381"],
            pupils: ["60be95fba9cbf1ab7efa144d", "60be960a4c8d888978b8b333", "60be961836091c0a99cac84f", "60be96765b7c532a697b8243"],
            created_by: "60bf0acdafa44f7eb1a0e3f6",
            updated_by: "60bf0acdafa44f7eb1a0e3f6"
        }
    ];

    ClassModel.insertMany(classes, function(err) {
        if(err) return callback(err);
        callback();
    });
};

require("dotenv").config();

mongoose.connect(function() {
    async.waterfall([ userSeeder, subjectSeeder, classSeeder ], function(err) {
        if(err) console.error(err);
        else console.info("DB seed completed!");
        process.exit();
    });
});
