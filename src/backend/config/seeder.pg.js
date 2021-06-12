const path = require("path");
const async = require("async");
const faker = require("faker");

async function init() {
    require("dotenv").config();
    const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

    await sequelize.dbConnector.query("DROP SCHEMA sms CASCADE");
    await sequelize.dbConnector.query("CREATE SCHEMA IF NOT EXISTS sms");

    const User = require(path.join(process.cwd(), "src/backend/user/user.pg.model"));
    const Program = require(path.join(process.cwd(), "src/backend/class/class.pg.model"));
    const Subject = require(path.join(process.cwd(), "src/backend/subject/subject.pg.model"));
    const Test = require(path.join(process.cwd(), "src/backend/subject/test.pg.model"));
    const TestResult = require(path.join(process.cwd(), "src/backend/subject/test-result.pg.model"));

    await sequelize.dbConnector.sync();

    function userSeeder(callback) {
        const users = [
            {
                id: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                role: "admin",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: "admin@sms.com",
                password: "P@ssw0rd"
            },
            {
                id: "7217656c-9446-4038-aed3-c2a4a2d3bcc6",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("one").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "5b4f3c03-8d54-4160-9d85-07dad3e8edd1",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("two").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "18c49987-2dcd-4547-a8a1-87f01a3fcc28",
                role: "teacher",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("three").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "b3547848-1347-498c-868a-423eb91b8a4d",
                program_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("four").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "370cdbf2-0ba2-4a29-b0aa-50b35e39e397",
                program_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("five").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "6be1f51f-88f7-4061-841d-24860cc4d8b8",
                program_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("six").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "afcf6a0c-bfeb-4de1-a0ee-07a16ded81d6",
                program_id: "cd0220f5-7822-463b-8587-bdcd77c9ea37",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("seven").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "b7679364-b991-415d-beb3-41468a96cb23",
                program_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eight").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "61e65123-b1c0-4950-ad0a-26822f2cdc9d",
                program_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("ten").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "dd0e1257-da5f-4429-b47c-e9397096c64d",
                program_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("eleven").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "2c3e5bae-929d-4a50-b105-083e17a86e0a",
                program_id: "cabe7408-f114-493a-bf5b-ee93b829d026",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("twelve").toLowerCase(),
                password: "P@ssw0rd"
            },
            {
                id: "198d79b5-cc75-481a-bdd5-32a6afb72962",
                role: "pupil",
                forename: faker.name.firstName(),
                surname: faker.name.lastName(),
                username: faker.internet.email("thirteen").toLowerCase(),
                password: "P@ssw0rd"
            }
        ];

        User.destroy({ truncate: { cascade: true } }).then(() => {
            User.bulkCreate(users, {
                returning: true,
                ignoreDuplicates: false
            }).then(function() {
                callback();
            });
        });
    }

    function programSeeder(callback) {
        const programs = [
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
            Program.bulkCreate(programs, {
                returning: true,
                ignoreDuplicates: false
            }).then(function () {
                callback();
            });
        });
    }

    function subjectSeeder(callback) {
        const subjects = [
            {
                id: "5d65b678-5408-4386-8116-dbef2bdd1fec",
                name: "Automotive Sensor Systems",
                teacher_id: "60be9b9d04e9a06e759e6a01",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "b660d77c-e8d8-4643-b927-0ecff997388e",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "5d65b678-5408-4386-8116-dbef2bdd1fec",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "5d65b678-5408-4386-8116-dbef2bdd1fec",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "5d65b678-5408-4386-8116-dbef2bdd1fec",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            },
            {
                id: "5d65b678-5408-4386-8116-dbef2bdd1fec",
                name: "Web Engineering",
                created_by: "405cedd7-e03a-40fb-849c-025a41f97ea4",
                updated_by: "405cedd7-e03a-40fb-849c-025a41f97ea4"
            }
        ];

        Subject.destroy({ truncate: { cascade: true } }).then(() => {
            Subject.bulkCreate(subjects, {
                returning: true,
                ignoreDuplicates: false
            }).then(function () {
                callback();
            });
        });
    }

    async.waterfall([
        userSeeder,
        programSeeder,
        subjectSeeder
    ], function (err) {
        if (err) console.error(err);
        else console.info("DB seed completed!");
        process.exit();
    });
}

init();
