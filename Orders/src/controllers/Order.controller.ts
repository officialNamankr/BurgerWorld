import "reflect-metadata";
import { OrderService } from "../services/Order.service";
import { Request, Response } from "express";
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    interfaces,
} from "inversify-express-utils";

@controller("/orders")
export class OrderController implements interfaces.Controller {
    [key: string]: any;
    constructor(
        private readonly orderService: OrderService,
    ){}

    @httpGet("/")
    async getOrdersByUserId(req:Request, res:Response) {
        const userid = req.currentUser!.id;
        const orders = await this.orderService.getOrdersbyUserId(userid);
        return orders;
    }

   
}