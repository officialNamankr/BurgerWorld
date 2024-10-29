import express, {Request,Response} from "express";
import {body} from "express-validator";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import _ from "lodash";
import { BadRequestError, requireAuth, requireRoles, validateRequest, UserType } from "@burger-world.com/common";
import ProductPublisher from "../events/product.publisher";
import { Category } from "../models/categories";

const router = express.Router();

router.post("/api/products",requireAuth,requireRoles(UserType.ADMIN),[

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

    try{
        const {title,price,description,image,category,countInStock,discount} = req.body;
        let categoryFromCache = await redisClient.hget("categories",category);
        let selectedCategoryId:string;
        if(categoryFromCache){
            const categoryFromCacheParsed = JSON.parse(categoryFromCache);
            selectedCategoryId = categoryFromCacheParsed.id;
        }else{
            const selectedCategoryFromDB = await Category.findById(category);
            if(!selectedCategoryFromDB){
                throw new BadRequestError("Category does not exist");
            }
            selectedCategoryId = selectedCategoryFromDB.id;
            await redisClient.hset("categories",category,JSON.stringify(selectedCategoryFromDB));
        }
        const product =  new Product({
            title,
            price,
            description,
            image,
            category:selectedCategoryId,
            countInStock,
            discount
        });
        await product.save();
        await product.populate({
            path:"category",
            select:"name"
        });
        //const addedproduct = _.pick(product,["id","title","price","description","image","category","discount","avgRating","countInStock"]);

        await redisClient.hset("products",product.id,JSON.stringify(product));
        const cachedCategoryDetails = await redisClient.hget("categoriesdetails",category);
        if(cachedCategoryDetails){
            const categoryDetails = JSON.parse(cachedCategoryDetails);
            categoryDetails.products.push(product);
            await redisClient.hset("categoriesdetails",category,JSON.stringify(categoryDetails));
        }

    const productPublisher = new ProductPublisher();
    console.log("Publishing product: ");
    
    await productPublisher.publish(product,"product.created");
    
    res.status(201).send(product);
    }
    catch(err){
        console.error(err);
    }
  

    //console.log(product);
    

    
});

export {router as newProductRouter};