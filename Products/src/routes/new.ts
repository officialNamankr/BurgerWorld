import express, {Request,Response} from "express";
import {body} from "express-validator";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import _ from "lodash";
import { BadRequestError, requireAuth, validateRequest } from "@burger-world.com/common";

const router = express.Router();

router.post("/api/products",[

    body("title")
    .not()
    .isEmpty()
    .withMessage("Title is required"),
    body("price")
    .isFloat({gt:0})
    .withMessage("Price must be greater than 0")
    .isFloat({lt:1000000})
    .withMessage("Price must be less than 1000000"),
    body("description")
    .not()
    .isEmpty()
    .withMessage("Description is required"),
    body("image")
    .not()
    .isEmpty()
    .withMessage("Image is required"),
    body("category")
    .not()
    .isEmpty()
    .withMessage("Category is required"),
    body("countInStock")
    .isFloat({gt:0})
    .withMessage("CountInStock must be greater than 0")
    .isFloat({lt:500})
    .withMessage("CountInStock must be less than 500"),
    body("discount")
    .isFloat({gt:0})
    .withMessage("Discount must be greater than 0").isFloat({lt:100}).withMessage("Discount must be less than 100"),
],validateRequest,async(req:Request,res:Response)=>{

    const {title,price,description,image,category,countInStock,discount} = req.body;
    const product = Product.build({
        title,
        price,
        description,
        image,
        category,
        countInStock,
        discount
    });
    await product.save();
    const addedproduct = _.pick(product,["id","title","price","description","image","category","discount","avgRating"]);

    await redisClient.hset("products",product.id,JSON.stringify(addedproduct));
    
    res.status(201).send(addedproduct);
});

export {router as newProductRouter};