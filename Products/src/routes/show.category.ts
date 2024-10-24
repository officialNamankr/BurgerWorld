import express,{Request,Response} from "express";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";

import { NotFoundError } from "@burger-world.com/common";
import { Category } from "../models/categories";

const router = express.Router();

router.get("/api/products/categories/:id",async(req:Request,res:Response)=>{
    const {id} = req.params;
    const cachedCategoryDetails = await redisClient.hget("categoriesdetails",id);
    if(cachedCategoryDetails){
        res.status(200).send(JSON.parse(cachedCategoryDetails));
        return;
    }
    console.log("Cache Missed");
    console.log(id);
    const category = await Category.findById(id);
    if(!category){
        throw new NotFoundError();
    }

    const products = await Product.find({
        category:id
    }).populate({
        path:"category",
        select:"name description"
    });
    if(!products){
        throw new NotFoundError();
    }
    const reqProducts = {
        category:category,
        products:products
    }
    await redisClient.hset("categoriesdetails",category.id,JSON.stringify(reqProducts));
    res.status(200).send(reqProducts);

});

export {router as showCategoryRouter}