import "reflect-metadata";
import { injectable } from "inversify";
import { Cart, CartAttrs, CartDoc, CartProduct } from "../models/cart";
import { Product } from "../models/products";
import { CartProdcutAttrs, GetCartAttrs, cartProduct, updateCartAttrs } from "../interfaces/Cart.Dto";
import { Types } from "mongoose";
import { ProductService } from "../services/poduct.service";
import { GetCart } from "../interfaces/Cart.Dto";


@injectable()
export class CartRepository {

    constructor(private readonly productService: ProductService) {}
    async create(attrs: CartAttrs) {
        const cart = new Cart(attrs);   
        await cart.save();
        return cart;
    }

    async findByUserId(userId: Types.ObjectId): Promise<CartProdcutAttrs[] | null> {
        const cart = await Cart.findOne({userId}).populate({
            path: 'products.product',
            model: 'Products'
        });
        console.log("Cart Repo");
        console.log(cart);
        
        if (!cart) return null;
        return cart.products;   
    }

    // async deleteByUserId(userId: string, productId: string) {
    //     const cart = await Cart.findOne({userId});
    //     if (!cart) return null;
    //     const products = cart.products;
    //     for (let i=0; i < products.length; i++) {
    //         if (products[i].product.id === productId) {
    //             if(products[i].quantity > 1) {
    //                 products[i].quantity--;
    //             } else {
    //                 products.splice(i,1);
    //                 i--;
    //             }
    //         }
    //     } 
    //     cart.products = products;
    //     await cart.save();
    //     return cart;
    // }

    async updateByUserId(userId: Types.ObjectId, updatedProducts: updateCartAttrs[]): Promise<CartDoc | null> {
        const cartToUpdate = await Cart.findOne({userId}).populate({
            path: 'products.product',
            model: 'Products'
        });
        console.log("Cart to update");
        console.log(cartToUpdate);
        
        if (!cartToUpdate) {
            return null;
        };
        cartToUpdate.products = [];
        for(const updatedProduct of updatedProducts) {
            console.log("Updates");
            console.log(updatedProduct);
            
            const product = (cartToUpdate.products as CartProdcutAttrs[]).find(product => product.product.id === updatedProduct.product);
            //const product = (cartToUpdate.products as CartDoc[]).find(product => (product.products as CartProdcutAttrs[]).find(prod => prod.product.id === updatedProduct.product));
            console.log("Updated product");
            console.log(product);
             
            if (product) {
                // const cartProduct = (product.products as CartProdcutAttrs[]).find(prod => prod.product.id === updatedProduct.product);
                // if (!cartProduct) {
                //     return null;
                // }
                product.quantity = updatedProduct.quantity;
            }else{
                const product = await this.productService.getProduct(updatedProduct.product);
                if (!product) {
                    return null;
                }
                const cartProduct : CartProdcutAttrs  =  {
                    product: product,
                    quantity: updatedProduct.quantity
                };

                (cartToUpdate.products as CartProdcutAttrs[]).push(cartProduct);
            }
        }
        console.log("Updated Cart");
        console.log(cartToUpdate);
        
        await cartToUpdate.save();
        return cartToUpdate;
    }
    
}