import express,{Request,Response} from "express";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";
import { NotFoundError } from "@burger-world.com/common";

const router = express.Router();

router.get("/api/products",async(req:Request,res:Response)=>{
    const cacheKey = "products";
    const cachedProducts = await redisClient.hgetall(cacheKey);
    const parsedProducts = Object.entries(cachedProducts).map(([key, value]) => ({
        id: key,
        ...JSON.parse(value)
      }));
    if(parsedProducts.length > 0){
         res.status(200).send(parsedProducts);
         return;
    }
    console.log("Cache Missed");
    
    const products = await Product.find({},{id:1,title:1,price:1,image:1,category:1,discount:1,avgRating:1});
    if(!products){
        throw new NotFoundError();
    }
    for(const product of products){
        await redisClient.hset("products",product.id,JSON.stringify(product));
    }
    await redisClient.expire(cacheKey,3600);
    res.status(200).send(products);
});

export {router as indexRouter}