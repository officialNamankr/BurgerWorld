import {injectable} from "inversify";
import "reflect-metadata";
import {Order} from "../models/order";
import { OrderAttrs } from "../models/order";

@injectable()
export class OrderRepository {

    
    async create(attrs: OrderAttrs) {
        const order = Order.build(attrs);   
        await order.save();
        return order;
    }

    async findById(id: string) {
        const order = await Order.findById(id);
        return order;
    }

    async findByUserId(userId: string) {
        const orders = await Order.find({userId});
        return orders;
    }

}