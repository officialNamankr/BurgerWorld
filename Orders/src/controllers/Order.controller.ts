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
import { OrderAttrs } from "../models/order";
import { OrderCreateRequestDto } from "../interfaces/OrderDto";

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

    @httpPost("/")
    async createOrder(req:Request, res:Response) {
        const {products} = req.body;
        const userid = req.currentUser!.id;
        console.log(products);  
        const orderToCreate: OrderCreateRequestDto = {
            userId: userid,
            products,
            discount: 0,
        }
        // console.log(orderToCreate);
        const order = await this.orderService.create(orderToCreate);
        return order;
    }
}