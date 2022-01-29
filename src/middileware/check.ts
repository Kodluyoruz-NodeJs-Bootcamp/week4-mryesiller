import { RequestHandler} from "express"
import * as jwt from "jsonwebtoken"
import {getRepository} from "typeorm"
import { User} from "../entity/User"



export const authUser : RequestHandler = async (req, res, next) => {

  if (req.cookies.jwt) {
    try {

      //VERIFY TOKEN       
      const token = req.cookies.jwt      
      let jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET as string)
      res.locals.jwtPayload = jwtPayload
      const id = res.locals.jwtPayload.userId;
      const userRepository = getRepository(User)
      let currentUser: User

      //CHECK IF USER EXISTS
      currentUser= await userRepository.findOneOrFail(id)
      if (!currentUser && !req.session.userID) {
        req.flash("errors", {msg: "Login required"})
        return res.redirect('/login')
      }       
      //THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next()
    } catch (err) {
      req.flash("errors", {msg:err.message})
      return next()
    }
  }
  next()
}


//CHECH JSONWEBTOKEN
export const authJwt: RequestHandler = (req, res, next) => {

  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err: any ) => {
      if (err) {
        req.flash('errors',{msg:err.message})
        res.redirect('/login')
      } else {        
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}





