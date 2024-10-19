import "reflect-metadata";
import {ProductRepository} from "../repos/Product.repo";
import {ProductAttrs, ProductDoc} from "../models/product";
import { injectable } from "inversify";

@injectable()
export class ProductService {
    constructor(private readonly productRepo: ProductRepository){}

    async getProducts() {
        const products = await this.productRepo.find();
        return products;
    }

    async getProduct(id: string) {
        const product = await this.productRepo.findById(id);
        return product;
    }

    async createProduct(attrs: ProductAttrs) {
        const product = await this.productRepo.create(attrs);
        return product;
    }
    async updateProductByEvent(data: any): Promise<ProductDoc | null> {
        const product = await this.productRepo.findByEventAndUpdate(data);
        return product;
    }
}
