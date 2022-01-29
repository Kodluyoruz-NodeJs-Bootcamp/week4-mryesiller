import { RequestHandler} from "express"
import {getRepository} from "typeorm"
import {User} from '../entity/User';

//GET USERS DATA FROM POSTGRES
export const usersData : RequestHandler = async(req,res) : Promise<void>=>{
    
    const users=await getRepository(User).find() 
    res.render("users",{
        users:users
    })
}