<h1 align="center">⚡ Gusto&RemoteTeam Bootcamp Typescript Auth Project with Postgres Database ⚡</h1>

![Gusto](/image/gusto.png)

<p> In this project, the user can create his own account and log in to the system. After logging into the system, he can change his registration information and password, and if he wishes, he can also delete his account. Login is required to view user records.</p>

<h2 align="center">🔥 Technologies 🔥</h2>

* NodeJS
* ts-node
* Typescript
* Static Files (express.static)
* Template Engine (pug)
* Dotenv
* Express
* Express-flash
* Express-session
* Express-validator
* Pg (Postgres Database)
* Bcrypt
* jsonwebtoken
* reflect-metadata
* typeorm
* MVC architecture

## Installation

Clone the project to your local repository
```javascript
git clone https://github.com/Kodluyoruz-NodeJs-Bootcamp/week4-mryesiller

```
Install the dependencies of the project

```
npm install
```
Change  .env file in the project's directory. Environment variables inside your .env file should look like this

```
SESSION_SECRET=<enter an arbitrary string here>
JWT_SECRET=<enter an arbitrary string here>
PORT=<enter your port number here>
```

Change  .ormconfig.json file in the project's directory. These variables connection settings to Postgres on your computer.

 ```
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": <your username>, 
   "password": <your password>,
   "database": <your database name>

```

# Project images 

![HomePage](/image/gusto_home.png)

![LoginPage](/image/gusto_login.png)

![SignupPage](/image/gusto_signup.png)

![ProfilePage](/image/gusto_profile.png)

![UsersPage](/image/gusto_users.png)

