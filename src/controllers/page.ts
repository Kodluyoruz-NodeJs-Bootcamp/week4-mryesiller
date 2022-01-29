import { RequestHandler } from "express"


//HOME PAGE
export const home:RequestHandler = (req,res): void=>{    
    res.render("home", {
        title: "Home",        
    })
}

//REGISTER PAGE
export const register :RequestHandler = (req,res): void => {    
    res.render("account/_signup",{
        title: "Create Account"
    })
}

//LOGIN PAGE
export const login :RequestHandler = (req,res): void => {
    res.render("account/_login",{
        title:"Login",        
    })
}

//ACCOUNT PAGE
export const getAccount : RequestHandler = (req,res): void => {
    res.render("account/_profile", {
        title: "Account Management"
    })
}