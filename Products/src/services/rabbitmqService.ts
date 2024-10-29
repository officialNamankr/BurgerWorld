import RabbitMQ from "../rabbitmq";

import amqp from 'amqplib';
class RabbitMQService {
    private  channel: amqp.Channel | null = null;
    private rabbitMQUrl: string = process.env.RABBITMQ_URL!;

     constructor() {
        // Initialize the RabbitMQ connection when the service is created

         this.init();
    }
    private async init() {
        await this.initialize();
    }
    private async initialize() {
        this.channel = await RabbitMQ.getInstance();
       // console.log(this.channel);
        
        //this.channel = await rabbitMQ.connect();
    }

    // Method to publish a message to an exchange
    public async publishMessage(exchange: string, message: string): Promise<void> {
        console.log("logging channel");
        
        console.log(this.channel);
        
        if (!this.channel) {
                await this.initialize();  
        }
        if(!this.channel) {
            throw new Error('RabbitMQ channel is not available');
        }
        console.log(`Publishing message to exchange "${exchange}"`);
        
        await this.channel.assertExchange(exchange, 'fanout', { durable: false });

        this.channel.publish(exchange, '', Buffer.from(message));
        console.log(`Message published to exchange "${exchange}"`);
    }

    // Method to consume messages from a queue
    public async consumeMessages(queue: string, callback: (msg: amqp.Message | null) => void): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not available');
        }
        await this.channel.assertQueue(queue, { durable: false });
        this.channel.consume(queue, callback, { noAck: true });
        console.log(`Consuming messages from queue: ${queue}`);
    }
}

export default RabbitMQService;
