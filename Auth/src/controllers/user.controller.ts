import "reflect-metadata";
import { Request, Response } from "express";
import UserService from "../services/user.service";
import { userCreationValildation } from "../utils/validations/userCreationValidation";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    interfaces,
} from "inversify-express-utils";
import { validateRequest } from "@burger-world.com/common";
import UserCreatedPublisher from "../events/auth.created.publisher";
import RabbitMQService from "../rabbitmq.service";

@controller("/users")
export default class UserController implements interfaces.Controller {
    [key: string]: any;
    constructor(public readonly userService: UserService) {}

    // @httpGet("/")
    // async getUsers(req: Request, res: Response) {
    //     const users = await this.userService.getUsers();
    //     res.send(users);
    // }

    @httpGet("/me")
    async getCurrentUser(req: Request, res: Response) {
        res.send(req.currentUser);
    }

    @httpPost("/signup", ...userCreationValildation, validateRequest)
    async createUser(req: Request, res: Response) {
        const user = await this.userService.addUser(req.body);
        const rabbitmqInstance = await RabbitMQService.getInstance();
        const userCreatedPublisher = new UserCreatedPublisher(rabbitmqInstance);
        await userCreatedPublisher.publish(user.id, "users", "user.created");
        res.status(201).send(user);
    }
    @httpPost("/logout")
    async logoutUser(req: Request, res: Response) {
        req.session = null;
        res.send({});
    }

    @httpPost("/login")
    async loginUser(req: Request, res: Response) {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await this.userService.loginUser(email, password);
        req.session = {
            jwt: user.token,};

        res.send(user);
    }
}