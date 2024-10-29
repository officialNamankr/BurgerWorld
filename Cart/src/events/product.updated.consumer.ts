import { inject, injectable } from 'inversify';
import { Types } from '../types/types';
import RabbitMQService from '../rabbitmq.service';
import amqplib from 'amqplib';
import { ProductService } from '../services/poduct.service';
import { ProductAttrs } from '../models/products';
import "reflect-metadata";
import { ProductUpdate } from '../interfaces/ProductUpdate';

@injectable()
class ProductUpdatedConsumer {
    //private rabbitMQService: RabbitMQService;
    private readonly queueName = 'product-updation-Queue';
    private readonly exchange = 'products';
    private readonly routingKey = 'product.updated';


    constructor(@inject(Types .RabbitMQService) private rabbitMQService: RabbitMQService, private readonly productService: ProductService) {
        this.rabbitMQService.on('channelReady', async () => {
            await this.startConsuming();
        });
        // this.startConsuming();
    }
    // Method to start consuming messages
    public async startConsuming(): Promise<void> {
        try {
             // 1. Ensure the exchange exists
             const channel = await this.rabbitMQService.getChannel();
             await channel.assertExchange(this.exchange, 'direct', { durable: false });
             // 2. Ensure the queue exists
             await channel.assertQueue(this.queueName, { durable: false });
             // 3. Bind the queue to the exchange using the routing key
             await channel.bindQueue(this.queueName, this.exchange, this.routingKey);
            await this.rabbitMQService.consumeMessages(this.queueName, this.handleMessage.bind(this));
            console.log(`Started consuming messages from queue for updation: ${this.queueName}`);
        } catch (error) {
            console.error(`Failed to consume messages from queue for updation: ${this.queueName}`, error);
        }
    }

    // Callback to handle each message received from the queue
    private async handleMessage(msg: amqplib.Message | null) {
        try{

            if (msg !== null) {
                const messageContent = msg.content.toString();
                const product = JSON.parse(messageContent);
                console.log('Received product updated message:', product);
                const productUpdated:ProductUpdate = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    discount: product.discount,
                    date:product.date,
                    version:product.version,
                    countInStock: product.countInStock
                }
                const updatedproduct = await this.productService.updateProductByEvent(productUpdated);  
                console.log('Product Updated:', updatedproduct);
                //await this.rabbitMQService.acknowledgeMessage(msg);
            }
        }
        catch(error){
            console.error('Failed to process product created message:', error);
            //this.rabbitMQService.acknowledgeMessage(msg);
        }
    }
}

export default ProductUpdatedConsumer;
