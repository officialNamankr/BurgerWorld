import express, {Request,Response} from "express";
import {body} from "express-validator";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import _ from "lodash";
import { BadRequestError, requireAuth, requireRoles, validateRequest, UserType } from "@burger-world.com/common";
import ProductPublisher from "../events/product.publisher";
import { Category } from "../models/categories";
import {upload} from "../helpers/multer";
import { s3Client as s3, s3Client } from "../helpers/s3Config";
import path from "path";
import {ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

router.post("/api/products/categories",requireAuth,requireRoles(UserType.ADMIN),[
    // body("name")
    // .not()
    // .isEmpty()
    // .withMessage("Name is required"),
    // // body("image")
    // // .not()
    // // .isEmpty()
    // // .withMessage("Image is required"),
    // body("description")
    // .not()
    // .isEmpty()
    // .isLength({min: 3, max: 100})
    // .withMessage("Description is required between 3 and 100 characters"),
],validateRequest,upload.single("image"),async(req:Request,res:Response)=>{
    
    const file = req.file;
    if(!file){
        throw new BadRequestError("Image is required");
    }
    const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `images/categories/${Date.now()}_${path.basename(file.originalname)}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read
    }
    // let image = "asdfasdf";
    console.log(params);
    try{
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        const {name,description} = req.body;
    const image = `https://${params.Bucket}.s3.ap-south-1.amazonaws.com/${params.Key}`;
    const category = Category.build({
       name,
        description,
        image,
    });
    await category.save();
    const addedCategory = _.pick(category,["id","name","description","image"]);

    await redisClient.hset("categories",category.id,JSON.stringify(addedCategory));
    
    res.status(201).send(addedCategory);
        
    }catch(error){
        console.log(error);
    }
    
});
export {router as newCategoryRouter};