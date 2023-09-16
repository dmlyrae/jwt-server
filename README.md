# jwt-server

A simple Node.js server using the Express framework with JWT authorization support. It is created as a test server to understand the principles of JWT tokens and authorization middleware.

Handles the following events:
- User registration (email/password)
- Email confirmation by clicking on a link
- Login authorization
- JWT token (access token) authorization
- Refreshing the access token using the refresh token
- Authorization reset (deleting the refresh token from the database)

The [nodemailer](https://www.npmjs.com/package/nodemailer) library is used to send a link to the registered email address.
The [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library is used for token generation.
The [class-validator](https://www.npmjs.com/package/class-validator) library is used for data validation.
The [typeorm](https://orkhan.gitbook.io/typeorm/) library is used for working with the database.
[Express.js](https://expressjs.com) is used for handling HTTP requests and working with cookies.

SQL scripts for creating a PostgreSQL database are stored in SQL folder. The port, host, and login/password are stored in the .env file.
