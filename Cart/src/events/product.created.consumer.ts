import { inject, injectable } from 'inversify';
import { Types } from '../types/types';
import RabbitMQService from '../rabbitmq.service';
import amqplib from 'amqplib';
import { ProductService } from "../services/poduct.service";
import { ProductAttrs } from "../models/products";
import "reflect-metadata";

@injectable()
class ProductCreatedConsumer {
    //private rabbitMQService: RabbitMQService;
    private readonly queueName = 'cart-product-created-queue';
    private readonly exchange = 'product.created';
    private readonly routingKey = 'product.created';
    constructor(@inject(Types.RabbitMQService) private rabbitMQService: RabbitMQService, private readonly productService: ProductService) {
        this.rabbitMQService.on('channelReady', async () => {
            await this.startConsuming();
        });
       //this.startConsuming();
    }
    // Method to start consuming messages
    public async startConsuming(): Promise<void> {
        try {
             // 1. Ensure the exchange exists
             const channel = await this.rabbitMQService.getChannel();
             await channel.assertExchange(this.exchange, 'fanout', { durable: false });

             // 2. Ensure the queue exists
             await channel.assertQueue(this.queueName, { durable: false });
             // 3. Bind the queue to the exchange using the routing key
             await channel.bindQueue(this.queueName, this.exchange, '');
            await this.rabbitMQService.consumeMessages(this.queueName, this.handleMessage.bind(this));
            console.log(`Started consuming messages from queue for creation: ${this.queueName}`);
        } catch (error) {
            console.error(`Failed to consume messages from queue creation: ${this.queueName}`, error);
        }
    }
    // Callback to handle each message received from the queue
    private async handleMessage(msg: amqplib.Message | null) {
        try{

            if (msg !== null) {
                const messageContent = msg.content.toString();
                const product = JSON.parse(messageContent);
                console.log('Received product created message:', product);
                const cat = {
                    id: product.category.id,
                    name: product.category.name
                }   
                const productCreated:ProductAttrs = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    category: cat,
                    discount: product.discount,
                    date:product.date,
                    countInStock: product.countInStock
                }
                const savedProduct = await this.productService.createProduct(productCreated);               
                console.log('Product created for Cart:', savedProduct);
                //await this.rabbitMQService.acknowledgeMessage(msg);
            }else{
                console.log('No product creation message received');
            }
        }
        catch(error){
            console.error('Failed to process product created message:', error);
            //this.rabbitMQService.acknowledgeMessage(msg);
        }
    }
}

export default ProductCreatedConsumer;
