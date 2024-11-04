import {injectable} from "inversify";
import "reflect-metadata";
import {Order} from "../models/order";
import { OrderAttrs } from "../models/order";

@injectable()
export class OrderRepository {

    
    async create(attrs: OrderAttrs) {
        const order = Order.build(attrs);
        console.log(order);
        try{

            await order.save();
        } 
        catch(err){
            console.log(err);
        }  
        return order;
    }

    async findById(id: string) {
        const order = await Order.findById(id);
        return order;
    }

    async findByUserId(userId: string) {
        const orders = await Order.find({userId}).populate({
            path: 'products.product',
            model: 'Products'
        });
        return orders;
    }

}