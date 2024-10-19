import "reflect-metadata";
import mongoose from "mongoose";
import { app,appConfigured } from "./app";
import { container } from "./container";
import ProductConsumer from "./events/product.created.consumer";
import ProductUpdatedConsumer from "./events/product.updated.consumer";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDb");
    const productConsumer = await container.getAsync(ProductConsumer);
    const productUpdatedConsumer = await container.getAsync(ProductUpdatedConsumer);
    console.log("product consumer started");
  } catch (err) {
    console.error(err);
  }
  
};

appConfigured.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();
