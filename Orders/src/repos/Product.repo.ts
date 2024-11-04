import "reflect-metadata";
import { injectable } from "inversify";
import {Product, ProductAttrs, ProductDoc} from "../models/product";
import { Types } from "mongoose";

@injectable()
export class ProductRepository {
    async find(): Promise<ProductDoc[]> {
        return await Product.find({});
    }

    async findById(id: string): Promise<ProductDoc | null> {
        const productId = new Types.ObjectId(id);
        return await Product.findOne({ _id: productId });
    }

    async create(attrs: ProductAttrs): Promise<ProductDoc> {
        const product = Product.build(attrs);
        await product.save();
        return product;
    }

    async findByEventAndUpdate(data:any): Promise<ProductDoc | null> {
        try{
            //const event  = {id: data.id, version: data.version };
        const product = await Product.findOne({
            _id: data.id,
            version: data.version-1,
        });
        if (!product) {
            throw new Error("Product not found");
        }
        product.set({
            title: data.title,
            price: data.price,
            description: data.description,
            image: data.image,
            discount: data.discount,
            date: data.date,
        });
        await product.save();
        return product;
        }
        catch(error){
            console.error(error);
            return null;
        }
        
    }
}
