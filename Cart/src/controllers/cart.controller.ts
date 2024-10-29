import "reflect-metadata";
import { Request, Response } from "express";
import {
    controller,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
} from "inversify-express-utils";
import { CartAttrs } from "../models/cart";
import { NotFoundError } from "@burger-world.com/common";
import { CartService } from "../services/cart.service";
import { updateCartProducts } from "../interfaces/Cart.Dto";
import mongoose from "mongoose";


@controller("/cart")
export class CartController implements interfaces.Controller {
    [key: string]: any;
    constructor(
        private readonly cartService: CartService
    ) {}


    @httpGet("/")
    async get(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser && req.currentUser.id;
        if(!userId){
            throw new NotFoundError();
        }
        console.log(userId);
        const user_id = new mongoose.Types.ObjectId(req.currentUser!.id);
        const cart = await this.cartService.getCart(user_id);
        console.log(cart);
        if (!cart) {
            throw new NotFoundError();
        }
        res.status(200).send(cart);
    }

    @httpPut("/")
    async updateCart(req: Request, res: Response): Promise<void> {
        const updatedCart : updateCartProducts = {
            userId: new mongoose.Types.ObjectId(req.currentUser!.id),
            products: req.body.products,
        }
        console.log("Updated Cart");
        
        console.log(updatedCart);
        
        const cart = await this.cartService.updateCart(updatedCart);
        res.status(201).send(cart);
    }
}