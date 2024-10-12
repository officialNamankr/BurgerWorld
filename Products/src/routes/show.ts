import express,{Request,Response} from "express";
import { Product } from "../models/products";
import { redisClient } from "../redisClient";

import { NotFoundError } from "@burger-world.com/common";

const router = express.Router();

router.get("/api/products/:id",async(req:Request,res:Response)=>{
    const {id} = req.params;
    const cachedProduct = await redisClient.hget("products",id);
    if(cachedProduct){
        res.status(200).send(JSON.parse(cachedProduct));
        return;
    }
    console.log("Cache Missed");
    console.log(id);
    
    const product = await Product.findById({
        id:id
    });
    if(!product){
        throw new NotFoundError();
    }
    res.status(200).send(product);
});

export {router as showRouter}