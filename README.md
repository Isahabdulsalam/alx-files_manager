# 0x04. Files Manager

## Project Overview
This project is part of the back-end trimester curriculum. The primary objective is to build a simple platform for uploading and viewing files. This project encompasses several key back-end technologies and practices, including:

- User authentication via a token
- Listing all files
- Uploading new files
- Changing file permissions
- Viewing files
- Generating thumbnails for images

The project will help consolidate your understanding of authentication, Node.js, MongoDB, Redis, pagination, and background processing.

## Team
- Isah Abdulsalam
- Stephen Okoth

## Learning Objectives
By the end of this project, you should be able to explain the following concepts without the help of Google:
- How to create an API with Express
- How to authenticate a user
- How to store data in MongoDB
- How to store temporary data in Redis
- How to set up and use a background worker

## Resources
Here are some resources to help you along the way:
- [Node JS getting started](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [Process API doc](https://nodejs.org/api/process.html)
- [Express getting started](https://expressjs.com/en/starter/installing.html)
- [Mocha documentation](https://mochajs.org/)
- [Nodemon documentation](https://nodemon.io/)
- [MongoDB](https://docs.mongodb.com/)
- [Bull](https://github.com/OptimalBits/bull)
- [Image thumbnail](https://www.npmjs.com/package/image-thumbnail)
- [Mime-Types](https://www.npmjs.com/package/mime-types)
- [Redis](https://redis.io/documentation)

## Project Structure
You will be guided step-by-step in building this platform, but you are encouraged to make your own decisions regarding implementation and file structure. The `utils` folder will be particularly useful for organizing helper functions and reusable code.

## Requirements
- **Editors:** vi, vim, emacs, Visual Studio Code
- **Environment:** Your files will be interpreted/compiled on Ubuntu 18.04 LTS using Node.js (version 12.x.x)
- **Code Standards:** 
  - All files should end with a new line
  - Use the `.js` extension for all code files
  - Code will be verified against lint using ESLint
- **Mandatory Files:** A `README.md` file at the root of the project

## Provided Files
- `package.json`
- `.eslintrc.js`
- `babel.config.js`

Don't forget to run `$ npm install` to install the necessary packages listed in `package.json`.

## Tasks

### 0. Redis utils
**Mandatory**

Inside the folder `utils`, create a file `redis.js` that contains the class `RedisClient`.

`RedisClient` should have:

- A constructor that creates a client to Redis:
  - Any error of the redis client must be displayed in the console (use `on('error')` of the redis client)
- A function `isAlive` that returns true when the connection to Redis is successful; otherwise, false.
- An asynchronous function `get` that takes a string key as an argument and returns the Redis value stored for this key.
- An asynchronous function `set` that takes a string key, a value, and a duration in seconds as arguments to store it in Redis (with an expiration set by the duration argument).
- An asynchronous function `del` that takes a string key as an argument and removes the value in Redis for this key.

After the class definition, create and export an instance of `RedisClient` called `redisClient`.

### 1. MongoDB utils
**Mandatory**

Inside the folder `utils`, create a file `db.js` that contains the class `DBClient`.

`DBClient` should have:

- A constructor that creates a client to MongoDB:
  - `host`: from the environment variable `DB_HOST` or default: `localhost`
  - `port`: from the environment variable `DB_PORT` or default: `27017`
  - `database`: from the environment variable `DB_DATABASE` or default: `files_manager`
- A function `isAlive` that returns true when the connection to MongoDB is successful; otherwise, false.
- An asynchronous function `nbUsers` that returns the number of documents in the collection `users`.
- An asynchronous function `nbFiles` that returns the number of documents in the collection `files`.

After the class definition, create and export an instance of `DBClient` called `dbClient`.

### 2. Express server setup
**Mandatory**

Inside `server.js`, create the Express server:

- It should listen on the port set by the environment variable `PORT` or by default `5000`.
- It should load all routes from the file `routes/index.js`.

Inside the folder `routes`, create a file `index.js` that contains all endpoints of our API:

- `GET /status` => `AppController.getStatus`
- `GET /stats` => `AppController.getStats`

Inside the folder `controllers`, create a file `AppController.js` that contains the definition of the 2 endpoints:

- `GET /status` should return if Redis is alive and if the DB is alive too by using the 2 utils created previously: `{ "redis": true, "db": true }` with a status code `200`.
- `GET /stats` should return the number of users and files in DB: `{ "users": 12, "files": 1231 }` with a status code `200`.
  - `users` collection must be used for counting all users.
  - `files` collection must be used for counting all files.

### 3. Create a new user
**Mandatory**

In the file `routes/index.js`, add a new endpoint:

- `POST /users` => `UsersController.postNew`

Inside `controllers`, add a file `UsersController.js` that contains the new endpoint:

`POST /users` should create a new user in DB:

- To create a user, you must specify an email and a password.
  - If the email is missing, return an error `Missing email` with a status code `400`.
  - If the password is missing, return an error `Missing password` with a status code `400`.
  - If the email already exists in DB, return an error `Already exist` with a status code `400`.
- The password must be stored after being hashed in SHA1.
- The endpoint returns the new user with only the email and the id (auto-generated by MongoDB) with a status code `201`.
- The new user must be saved in the collection `users`:
  - `email`: same as the value received.
  - `password`: SHA1 value of the value received.

### 4. Authenticate a user
**Mandatory**

In the file `routes/index.js`, add 3 new endpoints:

- `GET /connect` => `AuthController.getConnect`
- `GET /disconnect` => `AuthController.getDisconnect`
- `GET /users/me` => `UsersController.getMe`

Inside `controllers`, add a file `AuthController.js` that contains new endpoints:

`GET /connect` should sign-in the user by generating a new authentication token:

- By using the header `Authorization` and the technique of the Basic auth (Base64 of the `<email>:<password>`), find the user associated with this email and password (reminder: we are storing the SHA1 of the password).
  - If no user is found, return an error `Unauthorized` with a status code `401`.
  - Otherwise:
    - Generate a random string (using `uuidv4`) as the token.
    - Create a key: `auth_<token>`.
    - Use this key for storing in Redis (by using the redisClient created previously) the user ID for 24 hours.
    - Return this token: `{ "token": "155342df-2399-41da-9e8c-458b6ac52a0c" }` with a status code `200`.

Every authenticated endpoint of our API will look at this token inside the header `X-Token`.

`GET /disconnect` should sign-out the user based on the token:

- Retrieve the user based on the token:
  - If not found, return an error `Unauthorized` with a status code `401`.
  - Otherwise, delete the token in Redis and return nothing with a status code `204`.

Inside the file `controllers/UsersController.js`, add a new endpoint:

`GET /users/me` should retrieve the user based on the token used:

- Retrieve the user based on the token:
  - If not found, return an error `Unauthorized` with a status code `401`.
  - Otherwise, return the user object (email and id only).

### 5. First file
**Mandatory**

In the file `routes/index.js`, add a new endpoint:

- `POST /files` => `FilesController.postUpload`

Inside `controllers`, add a file `FilesController.js` that contains the new endpoint:

`POST /files` should create a new file in DB and on disk:

- Retrieve the user based on the token:
  - If not found, return an error `Unauthorized` with a status code `401`.
- To create a file, you must specify:
  - `name`: as filename.
  - `type`: either `folder`, `file`, or `image`.
  - `parentId`: (optional) as ID of the parent (default: `0` -> the root).
  - `isPublic`: (optional) as boolean to define if the file is public or not (default: `false`).
  - `data`: (only for type=`file`|`image`) as Base64 of the file content.
    - If the `name` is missing, return an error `Missing name` with a status code `400`.
    - If the `type` is missing or not part of the list of accepted types, return an error `Missing type` with a status code `400`.
    - If the `data` is missing and `type` != `folder`, return an error `Missing data` with a status code `400`.
    - If the `parentId` is set:
      - If no file is present in DB for this `parentId`, return an error `Parent not found` with a status code `400`.
      - If the file present in DB for this `parentId` is not of type `folder`, return an error `Parent is not a folder` with a status code `400`.
- The user ID should be added to the document saved in DB - as the owner of a file.
- If the `type` is `folder`, add the new file document in the DB and return the new file with a status code `201`.
- Otherwise:
  - All files will be stored locally in a folder (to create automatically if not present):
    - The relative path of this folder is given by the environment variable `FOLDER_PATH`.
    - If this variable is not present or empty, use `/tmp/files_manager` as the storing folder path.
  - Create a local path in the storing folder with the filename as a UUID.
  - Store the file in clear (reminder: `data` contains the Base64 of the file) in this local path.
  - Add the new file document in the collection `files` with these attributes:
    - `userId`: ID of the owner document (owner from the authentication).
    - `name`: same as the value received.
    - `type`: same as the value received.
    - `isPublic`: same as the value received.
    - `parentId`: same as the value received - if not present: `0`.
    - `localPath`: for a type=`file`|`image`, the absolute path to the file saved locally.
  - Return the new file with a status code `201`.

## Summary
This project is designed to help you understand and implement several critical back-end development concepts using Node.js, MongoDB, Redis, and other technologies. By the end of this project, you will have a comprehensive understanding of how to build a robust and secure file management system with user authentication, file handling, and database interactions.

Good luck, and happy coding!
