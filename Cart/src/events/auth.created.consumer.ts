import { inject, injectable } from 'inversify';
import { Types } from '../types/types';
import RabbitMQService from '../rabbitmq.service';
import amqplib from 'amqplib';
import { CartService } from '../services/cart.service';
import { CartAttrs } from '../models/cart';
import "reflect-metadata";

@injectable() 
class AuthCreatedConsumer {
    //private rabbitMQService: RabbitMQService;
    private readonly queueName = 'user-created-queue';
    private readonly exchange = 'users';
    private readonly routingKey = 'user.created';
    constructor(@inject(Types .RabbitMQService) private rabbitMQService: RabbitMQService, private readonly cartService: CartService) {
        this.rabbitMQService.on('channelReady', async () => {
            await this.startConsuming();
        });
    //    this.startConsuming();
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
                const userId  = JSON.parse(messageContent);
                console.log('Received Auth created message:', userId);
                const cart: CartAttrs = {
                    userId: userId,
                    products :[]
                }
                const savedProduct = await this.cartService.createCart(cart);               
                console.log('Cart created:', savedProduct);
                //await this.rabbitMQService.acknowledgeMessage(msg);
            }
        }
        catch(error){
            console.error('Failed to process user created message:', error);
            //this.rabbitMQService.acknowledgeMessage(msg);
        }
    }
}

export default AuthCreatedConsumer;
