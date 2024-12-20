import mongoose from "mongoose";
import RabbitMQService from "./rabbitmq.service";
import { app,appConfigured } from "./app";
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

    const rabbitMQService = await new RabbitMQService().init();

  } catch (err) {
    console.error(err);
  }
};

appConfigured.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});

start();
