import express,{Request,Response} from "express";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import { NotFoundError } from "@burger-world.com/common";
import { Category } from "../models/categories";

const router = express.Router();

router.get("/api/products/categories",async(req:Request,res:Response)=>{
    const cacheKey = "categories";
    const cachedCatgories = await redisClient.hgetall(cacheKey);
    const parsedCategories = Object.entries(cachedCatgories).map(([key, value]) => ({
        id: key,
        ...JSON.parse(value)
      }));
    if(parsedCategories.length > 0){
         res.status(200).send(parsedCategories);
         return;
    }
    console.log("Cache Missed");
    console.log("get Categories");
    
    const categories = await Category.find({});
    if(!categories){
        throw new NotFoundError();
    }
    for(const category of categories){
        await redisClient.hset("categories",category.id,JSON.stringify(category));
    }

    await redisClient.expire(cacheKey,3600);
    res.status(200).send(categories);
});

export {router as indexCategoryRouter}