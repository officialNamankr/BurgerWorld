import "reflect-metadata";
import { injectable } from "inversify";
import { Product, ProductAttrs } from "../models/products";
import { ProductDoc } from "../models/products";
import { Types } from "mongoose";

@injectable()
export class ProductRepository {
    async findByEvent(event: {
        id: string;
        version: number;
    }): Promise<ProductDoc | null> {
        return await Product.findOne({ id: event.id, version: event.version - 1 });
    }

    async find(): Promise<ProductDoc[]> {
        return await Product.find({});
    }

    async findById(id: Types.ObjectId): Promise<ProductDoc | null> {
        return await Product.findOne({ _id: id });
    }

    async create(product: ProductAttrs): Promise<ProductDoc> {
        const newProduct = Product.build(product);
        await newProduct.save();
        return newProduct;
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