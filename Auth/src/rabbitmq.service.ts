
import "reflect-metadata";
import { injectable } from "inversify";
import amqplib from 'amqplib';
import EventEmmiter  from 'events';
@injectable()
class RabbitMQService extends EventEmmiter {
    private static instance: RabbitMQService | null = null;
    private connection: amqplib.Connection | null = null;
    private channel: amqplib.Channel | null = null;
    private readonly rabbitMQUrl = process.env.RABBITMQ_URL!;

    constructor() {
        super();
    }

    // Static method to get the single instance
    public static async getInstance(): Promise<RabbitMQService> {
        if (this.instance === null) {
            this.instance = new RabbitMQService();
            await this.instance.init(); // Initialize connection and channel
        }
        return  this.instance;
    }

    // Initialize the RabbitMQ connection and channel
    public async init() {
        try{

            if (!this.connection) {
                this.connection = await amqplib.connect(this.rabbitMQUrl);
                this.connection.on('close', () => {
                    console.log('RabbitMQ connection closed');
                    this.connection = null;
                    this.channel = null;
                });
                this.connection.on('error', (err) => {
                    console.error('RabbitMQ connection error:', err);
                    this.connection = null;
                    this.channel = null;
                });
            }
    
            if (!this.channel) {
                this.channel = await this.connection.createChannel();
                console.log('Channel created RabbitMq orders');
                this.emit("channelReady");
                this.channel.on('close', () => {
                    console.log('RabbitMQ channel closed');
                    this.channel = null;
                });
                this.channel.on('error', (err) => {
                    console.error('RabbitMQ channel error:', err);
                    this.channel = null;
                });
                 
            }
        }
        catch (err) {
            console.error("Failed to connect ot RabbitMQ:", err);
          console.log("Retrying in 3 seconds...");
          setTimeout(async() => {
            await this.init();
          }, 3000);
        }
    }

    // Publish a message to an exchange
    public async publishMessage(exchange: string, routingKey: string, message: string): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not available');
        }
        await this.channel.assertExchange(exchange, 'fanout', { durable: false });
        this.channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Message published to exchange "${exchange}" with routing key "${routingKey}"`);
    }
    // New method to ensure the channel is initialized before use
    public async getChannel(): Promise<amqplib.Channel> {
        if (!this.channel) {
             await this.init(); // Initialize the channel if it's null
        }
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not available');
        }
        this.channel.on('close', () => {
            console.error('RabbitMQ channel closed');
            this.channel = null;
        });
    
        this.channel.on('error', (err) => {
            console.error('RabbitMQ channel error:', err);
            this.channel = null;
        });
        return this.channel;
    }
    // Consume messages from a queue
    public async consumeMessages(queue: string, callback: (msg: amqplib.Message | null) => void): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel is not available');
        }
        await this.channel.assertQueue(queue, { durable: false });
        this.channel.consume(queue, callback, { noAck: true });
        console.log(`Consuming messages from queue: ${queue}`);
    }

    public async acknowledgeMessage(msg: amqplib.Message): Promise<void> {
        const channel = await this.getChannel();
        channel.ack(msg); // Manually acknowledge the message
    }
}

export default RabbitMQService;
