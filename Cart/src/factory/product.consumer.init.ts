import { container } from "../container"
import { Types } from "../types/types"; // Adjust import path
import ProductConsumer from "../events/product.created.consumer"; // Adjust import path
import "reflect-metadata";
import RabbitMQService from "../rabbitmq.service";

async function createProductConsumer() {

    //const rabbitMQService = new RabbitMQService(process.env.RABBITMQ_URL!);


    const productConsumer = await  container.getAsync(ProductConsumer);
    await productConsumer.startConsuming();
}


export { createProductConsumer };