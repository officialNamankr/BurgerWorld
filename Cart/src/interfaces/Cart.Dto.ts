import { Types } from "mongoose";
import { ProductDoc } from "../models/products";
export interface GetCartAttrs {
    userId: Types.ObjectId;
    products: cartProduct[] | [];
    totalQuantity: number;
    totalPrice: number;
}

export interface cartProduct{
    product: ProductDoc;
        quantity: number;
        price: number;
        inStock: boolean;
}

export interface updateCartProducts {
    userId: Types.ObjectId;
    products: updateCartAttrs[] | [];
    
}

export interface updateCartAttrs {
    product: Types.ObjectId;
    quantity: number;
}

export interface CartProdcutAttrs {
    product: ProductDoc;
    quantity: number;
}