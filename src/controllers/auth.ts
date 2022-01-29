import { RequestHandler } from "express"
import { check, validationResult } from "express-validator"
import {getRepository} from "typeorm"
import { User} from "../entity/User"
import { hash, compare } from "bcryptjs"
import * as jwt from "jsonwebtoken"




//This interface is created for the information we will save the session.
declare module "express-session" {
  interface SessionData {
    browserInfo: String;
    userID: String;
  }
}

interface IUser {
    username: string,
    email: string,
    password: string 
}


//REGISTER POST 
export const postRegister : RequestHandler = async (req, res,next): Promise<void> => {

    try{
        await check("email", "Email is not valid").isEmail().run(req);
        await check("password", "Password must be at least 6 characters long").isLength({ min: 6 }).run(req)
        await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req)    

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
           req.flash("errors", errors.array())
           return res.redirect("/register")
        }    

        const { username, email, password} = req.body as IUser
        const userValid= await getRepository(User).findOne({email})

        if(userValid){
            req.flash("errors", {msg:"Email already exist"})
            return res.redirect("/register")
        }
        else{       

            const passwordHash = await hash(password, 10)

            const userRepository = getRepository(User);
            const user = await userRepository.create({
                username,
                 email,
                password : passwordHash       
            })        

            await userRepository.save(user)
            req.flash('success',{msg:'Account created.You can Login'});
            res.redirect("/register")
        }    
    }catch(err) {
        if(err){
            res.sendStatus(404)
            next()
         }
     } 
}


//LOGIN POST
export const postLogin : RequestHandler = async (req, res,next):Promise<void> => {

    try{
        await check("email", "Email is not valid").isEmail().run(req);
        await check("password", "Password cannot be blank").isLength({min: 1}).run(req)
    
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash("errors", errors.array())
            return res.redirect("/login")
        }

        const { email, password } = req.body as IUser    

        const user = await getRepository(User).findOne({ email })
        
        if (!user){
            req.flash('errors',{msg:'User is not registered'})
            return res.redirect("/register")
        }    
        const checkPassword = await compare(password, user.password)   

        if (!checkPassword){
            req.flash('errors',{msg:'Password is not correct'})
            return res.redirect("/login")
        }

        //Create session
        req.session.browserInfo = req.headers["user-agent"]
        req.session.userID = user.id

        //Create token    
        const token = jwt.sign({ userId: user.id},process.env.JWT_SECRET,{ expiresIn: "15m" })

        //Send jwt to cookie    
        res.cookie("jwt", token, { httpOnly: true })    
    
   
        req.flash("success", { msg: "Success! You are logged in." })    
        res.redirect("/login")
    }catch(err) {
        if(err){
            res.sendStatus(404)
            next()
         }
     }   
}


//LOGOUT
export const logout :RequestHandler = (req, res): void => {  

    res.cookie("jwt", "loggedout", { maxAge: 1 })    
    req.session.destroy(() => {       
        res.redirect("/")
    })

}




//UPDATE PROFIL
export const updateProfile :RequestHandler  = async (req, res, next): Promise<void> => {

    try{
        await check("email", "Please enter a valid email address.").isEmail().run(req)    

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash("errors", errors.array())
            return res.redirect("/account")
        }

        const { email,username } = req.body as IUser 

        //Get User Data
        const token = req.cookies.jwt      
        let jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string)
        res.locals.jwtPayload = jwtPayload
        const id = res.locals.jwtPayload.userId   

        const userRepository = getRepository(User);
        let currentUser: User
        currentUser= await userRepository.findOneOrFail(id)

        await getRepository(User).update(id,{email,username}).then(() => {
            
            res.cookie("jwt", "loggedout", { maxAge: 1 })    

            req.flash("success", { msg: "Profile information has been updated." })
            res.redirect("/login")

        })        

    }catch(err) {
        if(err){
            res.sendStatus(404)
            next()
         }
     }   
    
}


//UPDATE PASSWORD
export const updatePassword :RequestHandler = async (req, res, next): Promise<void> => {

    try{
        await check("password", "Password must be at least 6 characters long").isLength({ min: 6 }).run(req)
        await check("confirmPassword", "Passwords do not match").equals(req.body.password).run(req)

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash("errors", errors.array())
            return res.redirect("/account")
        }

        const {password} = req.body      

        const passwordHash = await hash(password, 10)

        //Get User Data
        const token = req.cookies.jwt      
        let jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string)
        res.locals.jwtPayload = jwtPayload
        const id = res.locals.jwtPayload.userId

        const userRepository = getRepository(User);
        let currentUser: User
        currentUser= await userRepository.findOneOrFail(id)
    
        await getRepository(User).update(id,{password:passwordHash});
    
        req.flash("success", { msg: "Password has been updated." })
        res.redirect("/account")

        }catch(err) {
           if(err){
               res.sendStatus(404)
               next()
            }
        }
    
}


//DELETE ACCOUNT
export const deleteAccount :RequestHandler= async (req, res, next): Promise<void> => {

    try{

        //Get User Data
        const token = req.cookies.jwt      
        let jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string)
        res.locals.jwtPayload = jwtPayload
        const id = res.locals.jwtPayload.userId

        const userRepository = getRepository(User);
        let currentUser: User
        currentUser= await userRepository.findOneOrFail(id)

        await getRepository(User).delete(id);
    
        res.cookie("jwt", "loggedout", { maxAge: 1 })    
        req.session.destroy(() => {  
           req.flash("success", { msg: "Account has been deleted." })     
           res.redirect("/")
        })

        }catch(err) {
        if(err){
            res.sendStatus(404)
            next()
         }
     } 
   
}

