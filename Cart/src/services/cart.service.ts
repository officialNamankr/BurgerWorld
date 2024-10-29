import "reflect-metadata";
import { injectable } from "inversify";
import { CartRepository } from "../repos/cart.repo";
import { CartAttrs } from "../models/cart";
import { NotFoundError } from "@burger-world.com/common";
import { cartProduct, updateCartAttrs, updateCartProducts } from "../interfaces/Cart.Dto";
import { ProductService } from "./poduct.service";
import mongoose, { Types } from "mongoose";
@injectable()
export class CartService {
    constructor(
        private readonly cartRepo: CartRepository, 
        private readonly productService: ProductService
    ) {}
    async createCart(attrs: CartAttrs) {
        const cart = await this.cartRepo.create(attrs);
        await cart.save();
        return cart;
    }
    async getCart(userId: Types.ObjectId) {
        const cart = await this.cartRepo.findByUserId(userId);
        console.log("Cart Service");
        
        console.log(cart);
        
        if (!cart) {
            throw new NotFoundError();
        }
        const cartProducts: cartProduct[] = [];
        const products = cart.products;
        for (let i=0; i < products.length; i++) {
            const productId = new mongoose.Types.ObjectId(products[i].product.id);
            const product = await this.productService.getProduct(productId);
            if (!product) {
                continue;
            }
            const cartProduct: cartProduct = {
                product: product,
                price: product.price,
                quantity: 0,
                inStock: false
            }
            if(products[i].quantity > product.countInStock) {
                cartProduct.inStock = false;
            }
            cartProduct.quantity = products[i].quantity;
            cartProducts.push(cartProduct);
        }
        const totalPrice = cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
        const totalQuantity = cartProducts.reduce((total, product) => total + product.quantity, 0);
        return {
            userId: cart.userId,
            products: cartProducts,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice
        }
    }

    async updateCart(updatedcart: updateCartProducts) {
        const { userId, products } = updatedcart;
        const user_id = new mongoose.Types.ObjectId(userId);
        const userCart = await this.cartRepo.findByUserId(userId);
        console.log("Cart of the user");
        
        console.log(userCart);
        if (!userCart) {
            throw new NotFoundError();
        }
        console.log("Products");
        
        console.log(products);
        
        const updatedProducts : updateCartAttrs[] =[];
        for (let i=0; i < products.length; i++) {
            const product = await this.productService.getProduct(products[i].product);
            console.log(product);
            
            if (!product) {
                continue;
            }
            const productQuantity = products[i].quantity;
            updatedProducts.push({
                product: product.id,
                quantity: productQuantity
            });
        }
        console.log(updatedProducts);
        
        const updatedCart = await this.cartRepo.updateByUserId( userId,updatedProducts );
        if (!updatedCart) {
            throw new NotFoundError();
        }
        return updatedCart;

    }
}