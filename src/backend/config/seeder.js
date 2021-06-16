const path = require("path");
const async = require("async");
const faker = require("faker");

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

    function userSeeder(callback) {
        const users = [
            {
                id: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                role: "admin",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: "admin@sms.com",
                password: "P@ssw0rd",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "7217656c-9446-4038-aed3-c2a4a2d3bcc6",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("one").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "5b4f3c03-8d54-4160-9d85-07dad3e8edd1",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("two").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "18c49987-2dcd-4547-a8a1-87f01a3fcc28",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("three").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "b3547848-1347-498c-868a-423eb91b8a4d",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("four").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "370cdbf2-0ba2-4a29-b0aa-50b35e39e397",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("five").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "6be1f51f-88f7-4061-841d-24860cc4d8b8",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("six").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "afcf6a0c-bfeb-4de1-a0ee-07a16ded81d6",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("seven").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "b7679364-b991-415d-beb3-41468a96cb23",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eight").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "61e65123-b1c0-4950-ad0a-26822f2cdc9d",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("ten").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "dd0e1257-da5f-4429-b47c-e9397096c64d",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eleven").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "2c3e5bae-929d-4a50-b105-083e17a86e0a",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("twelve").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "198d79b5-cc75-481a-bdd5-32a6afb72962",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("thirteen").toLowerCase(),
                password: "P@ssw0rd",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
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
                id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                name: "Automotive Software Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
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
                id: "91d1b6ec-3a83-4123-a2bc-6eb134e59ec5",
                name: "Automotive Sensor Systems",
                content: "General aspects of sensor application in vehicles Sensors for engine management, Driving assistance systems, Sensors for air quality control, Exhaust gas sensor, Sensors for acceleration, force, pressure, rotational speed",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                teacher_id: "7217656c-9446-4038-aed3-c2a4a2d3bcc6",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "40cb9c2c-2df3-49b2-9592-7b7245c5ff1c",
                name: "Software Platforms for Automotive Systems",
                content: "Introduction to the topic of 'Development of Automotive Controllers'. According to the V-model, relevant processes methods and technologies are considered.",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                teacher_id: "7217656c-9446-4038-aed3-c2a4a2d3bcc6",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "36fb4e61-50a9-4b55-8d03-bbb505facc42",
                name: "Formal Specification and Verification",
                content: "Theoretical basics of system modeling and simulation. System life cycle and system development processes. Formal specification technology for embedded systems.",
                class_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                teacher_id: "5b4f3c03-8d54-4160-9d85-07dad3e8edd1",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "1a6bf219-7669-43de-8373-db6f12e3bab2",
                name: "Compiler Construction",
                content: "Concepts and techniques of compiler construction that are required for the development of a compiler.",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                teacher_id: "7217656c-9446-4038-aed3-c2a4a2d3bcc6",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "0ce93236-045a-4933-8832-4f064603d1ee",
                name: "Databases and Web Techniques",
                content: "Basic techniques of web-programming to access databases, ODBC, JDBC, DCE, CORBA, COM/DCOM, portal-techniques, XML, web-services.",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                teacher_id: "5b4f3c03-8d54-4160-9d85-07dad3e8edd1",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "e1a8a90c-7630-4308-b801-4e3b0e21f163",
                name: "Data Security and Cryptography",
                content: "Turing machine, computability, NP-completeness, classic and modern cryptographic methods, digital signatures, hashes, etc.",
                class_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                teacher_id: "5b4f3c03-8d54-4160-9d85-07dad3e8edd1",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
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
                id: "2c742ac1-c2c5-48c5-8ae8-404ae94aa49d",
                name: "Automotive Sensor Systems: First Test",
                subject_id: "91d1b6ec-3a83-4123-a2bc-6eb134e59ec5",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "18738b51-c25d-4614-bf5c-a615febbf827",
                name: "Automotive Sensor Systems: Second Test",
                subject_id: "91d1b6ec-3a83-4123-a2bc-6eb134e59ec5",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "9a0fdd57-a420-4e7c-8c50-11b548f4b04d",
                name: "Automotive Sensor Systems: Third Test",
                subject_id: "91d1b6ec-3a83-4123-a2bc-6eb134e59ec5",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
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
