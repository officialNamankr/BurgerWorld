import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../events/types/userType";

interface UserPayload{
    id:string;
    email:string;
    role:UserType;
}

declare global{
    /**
     * Since we are using express middleware, we need to add a new property to the Request
     * interface so that we can access the user details in other parts of the application.
     * This is just a way of extending the existing Request interface.
     * We are using the namespace Express to extend the Request interface.
     * The currentUser property is an optional property that contains the user details.
     */
    namespace Express{
        interface Request{
            currentUser?:UserPayload
        }
    }
}

export const currentUser = (req:Request, res:Response, next:NextFunction)=>{
    if(!req.session?.jwt){
        return next();
    }
    try{
        const payload = jwt.verify(req.session.jwt,process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    }catch(err){
        return res.send({currentUser:null});
    }
    next();
}
