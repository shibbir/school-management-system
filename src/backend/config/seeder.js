const path = require("path");
const async = require("async");
const faker = require("faker");
const { v4: uuidv4 } = require("uuid");

async function init() {
    require("dotenv").config();
    const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

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
                password,
                updated_by: admin_id
            },
            {
                id: teacher1_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("one").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: teacher2_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("two").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: teacher3_id,
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("three").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil1_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("four").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil2_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("five").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil3_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("six").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil4_id,
                class_id: class1_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("seven").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil5_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eight").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil6_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("ten").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil7_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eleven").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil8_id,
                class_id: class2_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("twelve").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: pupil9_id,
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("thirteen").toLowerCase(),
                password,
                created_by: admin_id,
                updated_by: admin_id
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
                name: "Automotive Software Engineering",
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: class2_id,
                name: "Web Engineering",
                created_by: admin_id,
                updated_by: admin_id
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
                content: "General aspects of sensor application in vehicles Sensors for engine management, Driving assistance systems, Sensors for air quality control, Exhaust gas sensor, Sensors for acceleration, force, pressure, rotational speed",
                class_id: class1_id,
                teacher_id: teacher1_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: subject2_id,
                name: "Software Platforms for Automotive Systems",
                content: "Introduction to the topic of 'Development of Automotive Controllers'. According to the V-model, relevant processes methods and technologies are considered.",
                class_id: class1_id,
                teacher_id: teacher1_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: subject3_id,
                name: "Formal Specification and Verification",
                content: "Theoretical basics of system modeling and simulation. System life cycle and system development processes. Formal specification technology for embedded systems.",
                class_id: class1_id,
                teacher_id: teacher2_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: subject4_id,
                name: "Compiler Construction",
                content: "Concepts and techniques of compiler construction that are required for the development of a compiler.",
                class_id: class2_id,
                teacher_id: teacher1_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: subject5_id,
                name: "Databases and Web Techniques",
                content: "Basic techniques of web-programming to access databases, ODBC, JDBC, DCE, CORBA, COM/DCOM, portal-techniques, XML, web-services.",
                class_id: class2_id,
                teacher_id: teacher2_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                id: subject6_id,
                name: "Data Security and Cryptography",
                content: "Turing machine, computability, NP-completeness, classic and modern cryptographic methods, digital signatures, hashes, etc.",
                class_id: class2_id,
                teacher_id: teacher2_id,
                created_by: admin_id,
                updated_by: admin_id
            }
        ];

        Subject.destroy({ truncate: { cascade: true } }).then(() => {
            Subject.bulkCreate(subjects, {
                returning: true,
                ignoreDuplicates: false
            }).then(() => callback());
        });
    }

    function testSeeder(callback) {
        const tests = [
            {
                name: "Automotive Sensor Systems: First Test",
                subject_id: subject1_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                name: "Automotive Sensor Systems: Second Test",
                subject_id: subject1_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                name: "Automotive Sensor Systems: Third Test",
                subject_id: subject1_id,
                created_by: admin_id,
                updated_by: admin_id
            },

            {
                name: "Compiler Construction: First Test",
                subject_id: subject4_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                name: "Compiler Construction: Second Test",
                subject_id: subject4_id,
                created_by: admin_id,
                updated_by: admin_id
            },
            {
                name: "Compiler Construction: Third Test",
                subject_id: subject4_id,
                created_by: admin_id,
                updated_by: admin_id
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
        testSeeder
    ], function (err) {
        if (err) console.error(err);
        else console.info("DB seed completed!");
        process.exit();
    });
}

init();
