import "reflect-metadata";
import { injectable } from "inversify";
import {  ProductAttrs } from "../models/products";
import { ProductDoc } from "../models/products";
import { ProductRepository } from "../repos/product.repo";
import { Types } from "mongoose";

@injectable()
export class ProductService {

    constructor( private readonly productRepo: ProductRepository) { }

    // async getProducts() {
    //     return await this.productRepo.find();
    // }

    async getProduct(id: Types.ObjectId){
        return await this.productRepo.findById(id);
    }

    async createProduct(product: ProductAttrs) {
        const newProduct = await this.productRepo.create(product);
        return newProduct;
    }
    async updateProductByEvent(data: any): Promise<ProductDoc | null> {
        const product = await this.productRepo.findByEventAndUpdate(data);
        return product;
    }

}