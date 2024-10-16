import { injectable } from "inversify";
import "reflect-metadata";
import { UserAttrs } from "../models/user";
import { NotAuthorizedError, NotFoundError } from "@burger-world.com/common";
import UserRepository from "../repos/User.repo";
import {Password} from "../utils/password";
import Jwt from "jsonwebtoken"


@injectable()
export default class UserService{
    constructor(private readonly userRepository:UserRepository){}

    async getUser(email:string){
        const user = await this.userRepository.getUser(email);
        return user;
    }

    async getUserById(id:string){
        const user = await this.userRepository.getUserById(id);
        if(!user){
            throw new NotFoundError();
        }
        return user;
    }


    async loginUser(email:string, password:string){
        const user = await this.getUser(email);
        if(!user){
            throw new NotFoundError();
        }
        const isMatch = await Password.compare(user.password, password);
        if(!isMatch){
            throw new NotAuthorizedError();
        }
        const token = Jwt.sign({id:user._id, email:user.email, role:user.role}, process.env.JWT_KEY!);
        return {user, token};
    }

    async addUser(user:UserAttrs){
        const newUser = await this.userRepository.addUser(user);
        return newUser;
    }


}