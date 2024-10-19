import express,{Request,Response} from "express";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import { NotFoundError, requireAuth, requireRoles, validateRequest, UserType } from "@burger-world.com/common";
import { body } from "express-validator";
import ProductPublisher from "../events/product.publisher";

const router = express.Router();

router.put("/api/products/:id", requireAuth,requireRoles(UserType.ADMIN), [body("title")
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
    .withMessage("Discount must be greater than 0").isFloat({lt:100}).withMessage("Discount must be less than 100"),],validateRequest,async(req:Request,res:Response)=>{
    const {id} = req.params;
    const {title,price,description,image,category,countInStock,discount} = req.body;
    const product = await Product.findById(id);
    console.log(product);
    
    if(!product){
        throw new NotFoundError();
    }
    product.set({title,price,description,image,category,countInStock,discount});
    await product.save();
    await redisClient.hset("products",product.id,JSON.stringify(product));

    const productPublisher = new ProductPublisher();
    console.log("Publishing product: ");
    await productPublisher.publish(product,"products","product.updated");

    res.status(200).send(product);
});

export {router as updateRouter}