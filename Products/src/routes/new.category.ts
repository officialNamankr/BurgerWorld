import express, {Request,Response} from "express";
import {body} from "express-validator";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import _ from "lodash";
import { BadRequestError, requireAuth, requireRoles, validateRequest, UserType } from "@burger-world.com/common";
import ProductPublisher from "../events/product.publisher";
import { Category } from "../models/categories";

const router = express.Router();

router.post("/api/products/categories",requireAuth,requireRoles(UserType.ADMIN),[
    body("name")
    .not()
    .isEmpty()
    .withMessage("Name is required"),
    body("image")
    .not()
    .isEmpty()
    .withMessage("Image is required"),
    body("description")
    .not()
    .isEmpty()
    .isLength({min: 3, max: 100})
    .withMessage("Description is required between 3 and 100 characters"),
],validateRequest,async(req:Request,res:Response)=>{
    const {name,description,image,} = req.body;
    const category = Category.build({
       name,
        description,
        image,
    });
    await category.save();
    const addedCategory = _.pick(category,["id","name","description","image"]);

    await redisClient.hset("categories",category.id,JSON.stringify(addedCategory));
    
    res.status(201).send(addedCategory);
});
export {router as newCategoryRouter};