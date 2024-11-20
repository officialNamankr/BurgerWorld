import mongoose from "mongoose";
import { app } from "./app";
import RabbitMQService from "./services/rabbitmqService";
import RabbitMQ from "./rabbitmq";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }

    if(!process.env.RABBITMQ_URL) {
        throw new Error("RABBITMQ_URL must be defined");
    }
    if(!process.env.S3_BUCKET_NAME) {
        throw new Error("s3_BUCKET_NAME must be defined");
    }

    if(!process.env.S3_ACCESS_KEY) {
        throw new Error("S3_ACCESS_KEY must be defined");
    }

    if(!process.env.S3_SECRET_KEY) {
        throw new Error("S3_SECRET_ACCESS_KEY must be defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDb");

        const rabbitMQ =  new RabbitMQService()


        // await rabbitMQ.consumeMessages("products", (msg) => {
        //     if (msg) {
        //         console.log("Message received:", msg.content.toString());
        //     }
        // });
        // await rabbitMQ.consumeMessages("products", (msg) => {
        //     if (msg) {
        //         console.log("Message received:", msg.content.toString());
        //     }
        // })
        // console.log("Connected to RabbitMQ");
    } catch (err) {
        console.error(err);
    }


};
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
start();