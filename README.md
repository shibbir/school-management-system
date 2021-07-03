# School Management System
> A single page application for managing grades in a school. Built with React, Node.js, and PostgreSQL.

## Development Environment Setup
- [Install Node.js >= 14.5](https://nodejs.org/en/)
- [Install PostgreSQL >= 12.0](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- After installing PostgreSQL, create a database named `school_management_system`

## Configuring Environment Variables
> By default, this project comes with a pre-configured .env file. Feel free to adjust the values if needed. Details of each environment variables are below:

Name | Is Mandatory | Default Value | Description
------------ | ------------- | ------------- | -------------
PORT | Yes | `6060` | On which port the web server will run
ACCESS_TOKEN_SECRET | Yes | `a83ac7ff-ae62-4f9a-bdd4-73067d192bff` | A secret string to generate an access token. Learn more from [here](https://www.oauth.com/oauth2-servers/access-tokens/)
REFRESH_TOKEN_SECRET | Yes | `bc5848c9-6b58-40c8-b555-1784974ed1c6` | A secret string to generate a refresh token. Learn more from [here](https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/)
COOKIE_SECRET | Yes | `23b791bb-b08b-432d-b027-ea30556af991` | A secret string for signing cookies. Learn more from [here](https://expressjs.com/en/resources/middleware/cookie-parser.html)
POSTGRES_CONNECTION_STRING | Yes | `postgres://postgres:root@localhost:5432` | PostgreSQL connection string. Learn more from [here](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
POSTGRES_DATABASE | Yes | `school_management_system` | PostgreSQL database name
POSTGRES_DATABASE_SCHEMA | Yes | `sms` | PostgreSQL database schema name

## NPM Scripts
> First, open your favorite terminal or command prompt and navigate to the project root directory. After that, execute from the below scripts as necessary:

```bash
# To install npm packages
$ npm install

# To drop and re-craete the schema and the tables
$ npm run seed

# To start the development build with the watch mode
$ npm start

# To run the production build without the watch mode
$ npm run production

# To stop the application running in background after a production run. Since in production mode the application will be running in background.
$ npm run stop
```

## API Documentation

Visit [here](http://localhost:6060/api-docs) for an in-depth API documentation.

## License
<a href="https://opensource.org/licenses/MIT">The MIT License</a>
