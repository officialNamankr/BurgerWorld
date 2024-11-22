import "reflect-metadata";
import { injectable } from "inversify";
import { OrderAttrs } from "../models/order";
import { OrderRepository } from "../repos/Order.repo";
import { BadRequestError, OrderStatus } from "@burger-world.com/common";
import { ProductDoc, Product } from "../models/product";
import { ProductRepository } from "../repos/Product.repo";
import { OrderCreateRequestDto } from "../interfaces/OrderDto";
import { ProductService } from "./Product.service";
import { Types } from "mongoose";

@injectable()
export class OrderService {

    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly productService: ProductService
    ){}

    async create(attrs: OrderCreateRequestDto) {
        const {userId, products, discount} = attrs;
        
        const productIds = products.map(product => product.id);
        console.log(productIds);
        const fetchedProducts = await Promise.all(
            productIds.map(id => this.productService.getProduct(id))
        );
        console.log(fetchedProducts);
        
        if(fetchedProducts.some(product => !product)){
            throw new BadRequestError("Product not found");
        }
        const productMap = fetchedProducts.reduce((map, product) => {
            map.set(product!.id, product!);
            return map;
        }, new Map<string, ProductDoc>());
        console.log(productMap);
        
        let selectedProducts:any[] = [];
        products.forEach(product => {
            const fetchedProduct = productMap.get(product.id);
            if(!fetchedProduct){
                throw new BadRequestError(`Product with id ${product.id} does not exist`);
            }
            const SelctedproductDetails = {
                product: fetchedProduct.id,
                quantity: product.quantity,
                price: fetchedProduct.price * product.quantity
            }
            selectedProducts.push(SelctedproductDetails);
        });
        console.log(selectedProducts);

        const orderData:OrderAttrs = {
            userId,
            // status: OrderStatus.CREATED,
            products: selectedProducts,
            discount,
            // date: new Date()
        }

        console.log(orderData);

        
        const order = await this.orderRepo.create(orderData);
        console.log(order);
        

        return order;  
    }

    async getOrdersbyUserId(userId: string) {
        const orders = await this.orderRepo.findByUserId(userId);
        return orders;
    }
}