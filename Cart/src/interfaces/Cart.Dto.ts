import { Types } from "mongoose";
import { ProductDoc } from "../models/products";
export interface GetCartAttrs {
    userId: Types.ObjectId;
    products: cartProduct[] | [];
    totalQuantity: number;
    totalPrice: number;
}

export interface CartItemProduct{
    id: Types.ObjectId;
    title: string;
    price: number;
}

export interface cartProduct{
        product: CartItemProduct;
        quantity: number;
        price: number;
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

export interface GetCart {
    products: CartProdcutAttrs[] | [];
}