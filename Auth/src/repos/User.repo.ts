import {injectable} from "inversify";
import "reflect-metadata";
import _ from "lodash";
import {IUser} from "../interfaces/user.interface";
import {User} from "../models/user";
import { NotFoundError } from "@burger-world.com/common";
import { UserAttrs } from "../models/user";

@injectable()
export default class UserRepository{
    async getUser(email:string){
        const user = await User.findOne({email});
        return user;
    }

    async getUserById(id:string){
        const user = await User.findById(id);
        return  user;
    }

    async addUser(user:UserAttrs){
        const newUser = User.build(user);
        await newUser.save();
        return newUser as IUser;
    }
}