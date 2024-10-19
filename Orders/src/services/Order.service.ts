import "reflect-metadata";
import { injectable } from "inversify";
import { OrderAttrs } from "../models/order";
import { OrderRepository } from "../repos/Order.repo";
import { BadRequestError, OrderStatus } from "@burger-world.com/common";
import { ProductDoc, Product } from "../models/product";
import { ProductRepository } from "../repos/Product.repo";

@injectable()
export class OrderService {

    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly productRepo: ProductRepository
    ){}

    async create(attrs: OrderAttrs) {
        const {userId, products, discount} = attrs;
        
        const productIds = products.map(product => product.product.id);
        const fetchedProducts = await Promise.all(
            productIds.map(id => this.productRepo.findById(id))
        );
        if(fetchedProducts.some(product => !product)){
            throw new BadRequestError("Product not found");
        }
        const productMap = fetchedProducts.reduce((map, product) => {
            map.set(product!.id, product!);
            return map;
        }, new Map<string, ProductDoc>());

        let selectedProducts:any[] = [];
        products.forEach(product => {
            const fetchedProduct = productMap.get(product.product.id);
            if(!fetchedProduct){
                throw new BadRequestError(`Product with id ${product.product.id} does not exist`);
            }
            const SelctedproductDetails = {
                product: fetchedProduct,
                quantity: product.quantity,
                price: product.price
            }
            selectedProducts.push(SelctedproductDetails);
        });

        const orderData:OrderAttrs = {
            userId,
            status: OrderStatus.CREATED,
            products: selectedProducts,
            discount,
            date: new Date()
        }
        
        const order = await this.orderRepo.create(orderData);

        return order;  
    }

    async getOrdersbyUserId(userId: string) {
        const orders = await this.orderRepo.findByUserId(userId);
        return orders;
    }
}