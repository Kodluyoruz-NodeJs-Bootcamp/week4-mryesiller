import express,{ Application} from "express"
import {createConnection} from "typeorm"
import flash from "express-flash"
import session from "express-session";
import path from "path"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

//CONTROLLERS IMPORTED
import * as authController from "./controllers/auth"
import * as pageController from "./controllers/page"
import * as checkController from "./middileware/check"
import * as userController from "./controllers/usersData"

const app: Application = express()
dotenv.config({ path: ".env" })

//POSTGRES SETTINGS
const main = async () => {
	try {
		await createConnection().then(() => {            
            console.log('Connected to Postgres')
        })    

	} catch (error) {
		console.error(error);
		throw new Error('Unable to connect to db');
	}
}

main()

//EXPRESS SETTINGS
app.set("port", process.env.PORT || 5000)
app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "pug")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000,
    }
}))

//ROUTES
app.get('/',checkController.authUser, pageController.home)
app.get('/register',pageController.register)
app.get('/login',pageController.login)
app.get('/logout',authController.logout)
app.get('/account',checkController.authUser,checkController.authJwt,pageController.getAccount)
app.get('/users',checkController.authUser,checkController.authJwt,userController.usersData)

app.post('/register', authController.postRegister)
app.post('/login', authController.postLogin)
app.post('/account/update',checkController.authUser,checkController.authJwt,authController.updateProfile)
app.post('/account/password',checkController.authUser,checkController.authJwt,authController.updatePassword)
app.post('/account/delete',checkController.authUser,checkController.authJwt,authController.deleteAccount)

//LISTENING SERVER
app.listen(app.get('port'), () => {
    console.log(`SERVER LISTENING ON ${app.get('port')}`)
    console.log("  Press CTRL-C to stop\n")
})