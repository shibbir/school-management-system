const path = require("path");
const async = require("async");
const faker = require("faker");
const { v4: uuidv4 } = require("uuid");

async function init() {
    require("dotenv").config();
    const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

    await sequelize.dbConnector.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.POSTGRES_DATABASE_SCHEMA}`);
    await sequelize.dbConnector.query(`DROP SCHEMA ${process.env.POSTGRES_DATABASE_SCHEMA} CASCADE`);
    await sequelize.dbConnector.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.POSTGRES_DATABASE_SCHEMA}`);

    const User = require(path.join(process.cwd(), "src/backend/manage-users/user.model"));
    const Program = require(path.join(process.cwd(), "src/backend/manage-classes/class.model"));
    const Subject = require(path.join(process.cwd(), "src/backend/manage-subjects/subject.model"));
    const Test = require(path.join(process.cwd(), "src/backend/manage-tests/test.model"));
    require(path.join(process.cwd(), "src/backend/manage-test-results/test-result.model"));

    await sequelize.dbConnector.sync();

    const admin_id = uuidv4();

    const teacher1_id = uuidv4();
    const teacher2_id = uuidv4();
    const teacher3_id = uuidv4();

    const pupil1_id = uuidv4();
    const pupil2_id = uuidv4();
    const pupil3_id = uuidv4();
    const pupil4_id = uuidv4();
    const pupil5_id = uuidv4();
    const pupil6_id = uuidv4();
    const pupil7_id = uuidv4();
    const pupil8_id = uuidv4();
    const pupil9_id = uuidv4();

    const class1_id = uuidv4();
    const class2_id = uuidv4();

    const subject1_id = uuidv4();
    const subject2_id = uuidv4();
    const subject3_id = uuidv4();
    const subject4_id = uuidv4();
    const subject5_id = uuidv4();
    const subject6_id = uuidv4();

    const password = "P@ssw0rd";

    function userSeeder(callback) {
        const users = [
            {
                id: admin_id,
                role: "admin",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: "admin@sms.com",
                password
            },
            {
                id: teacher1_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("one").toLowerCase(),
                password
            },
            {
                id: teacher2_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("two").toLowerCase(),
                password
            },
            {
                id: teacher3_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("three").toLowerCase(),
                password
            },
            {
                id: pupil1_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("four").toLowerCase(),
                password
            },
            {
                id: pupil2_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("five").toLowerCase(),
                password
            },
            {
                id: pupil3_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("six").toLowerCase(),
                password
            },
            {
                id: pupil4_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("seven").toLowerCase(),
                password
            },
            {
                id: pupil5_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eight").toLowerCase(),
                password
            },
            {
                id: pupil6_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("ten").toLowerCase(),
                password
            },
            {
                id: pupil7_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eleven").toLowerCase(),
                password
            },
            {
                id: pupil8_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("twelve").toLowerCase(),
                password
            },
            {
                id: pupil9_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("thirteen").toLowerCase(),
                password
            }
        ];

        User.destroy({ truncate: { cascade: true } }).then(() => {
            User.bulkCreate(users, {
                returning: true,
                ignoreDuplicates: false
            }).then(() => callback());
        });
    }

    function classSeeder(callback) {
        const classes = [
            {
                id: class1_id,
                name: "Automotive Software Engineering"
            },
            {
                id: class2_id,
                name: "Web Engineering"
            }
        ];

        Program.destroy({ truncate: { cascade: true } }).then(() => {
            Program.bulkCreate(classes, {
                returning: true,
                ignoreDuplicates: false
            }).then(() => callback());
        });
    }

    function subjectSeeder(callback) {
        const subjects = [
            {
                id: subject1_id,
                name: "Automotive Sensor Systems",
                teacher_id: teacher1_id
            },
            {
                id: subject2_id,
                name: "Software Platforms for Automotive Systems",
                teacher_id: teacher1_id
            },
            {
                id: subject3_id,
                name: "Formal Specification and Verification",
                teacher_id: teacher2_id
            },
            {
                id: subject4_id,
                name: "Compiler Construction",
                teacher_id: teacher1_id
            },
            {
                id: subject5_id,
                name: "Databases and Web Techniques",
                teacher_id: teacher2_id
            },
            {
                id: subject6_id,
                name: "Data Security and Cryptography",
                teacher_id: teacher2_id
            }
        ];

        Subject.destroy({ truncate: { cascade: true } }).then(() => {
            Subject.bulkCreate(subjects, {
                returning: true,
                ignoreDuplicates: false
            }).then(() => callback());
        });
    }

    function classSubjectSeeder(callback) {
        Promise.all([
            Subject.findByPk(subject1_id),
            Subject.findByPk(subject2_id),
            Subject.findByPk(subject3_id),
            Subject.findByPk(subject4_id),
            Subject.findByPk(subject5_id),
            Subject.findByPk(subject6_id)
        ]).then(function(subjects) {
            Program.findByPk(class1_id).then(function(class_1) {
                class_1.addSubjects([subjects[0], subjects[1], subjects[2]]).then(function() {
                    Program.findByPk(class2_id).then(function(class_2) {
                        class_2.addSubjects([subjects[3], subjects[4], subjects[5]]).then(function() {
                            callback();
                        });
                    });
                });
            });
        });
    }

    function testSeeder(callback) {
        const tests = [
            {
                name: "Automotive Sensor Systems: First Test",
                subject_id: subject1_id
            },
            {
                name: "Automotive Sensor Systems: Second Test",
                subject_id: subject1_id
            },
            {
                name: "Automotive Sensor Systems: Third Test",
                subject_id: subject1_id
            },

            {
                name: "Compiler Construction: First Test",
                subject_id: subject4_id
            },
            {
                name: "Compiler Construction: Second Test",
                subject_id: subject4_id
            },
            {
                name: "Compiler Construction: Third Test",
                subject_id: subject4_id
            }
        ];

        Test.destroy({ truncate: { cascade: true } }).then(() => {
            Test.bulkCreate(tests, {
                returning: true,
                ignoreDuplicates: false
            }).then(() => callback());
        });
    }

    async.waterfall([
        classSeeder,
        userSeeder,
        subjectSeeder,
        classSubjectSeeder,
        testSeeder
    ], function (err) {
        if (err) console.error(err);
        else console.info("DB seed completed!");
        process.exit();
    });
}

init();
