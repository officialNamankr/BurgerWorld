import amqplib,{Connection, Channel} from "amqplib";

export class RabbitMQ {
    private static instance: RabbitMQ;
    private connection: Connection | null = null;
    private  channel: Channel | null = null;
    private rabbitmqUrl:string = process.env.RABBITMQ_URL!;

    constructor() {
    }

    public static async getInstance(): Promise<amqplib.Channel | null> {
        if (!RabbitMQ.instance) {
            console.log("Instance not found, creating new instance...");
            RabbitMQ.instance = new RabbitMQ();
            return await RabbitMQ.instance.connect();
        }
        console.log("Instance found, returning existing instance...");
        
        return  RabbitMQ.instance.channel;
    }

    public async connect(): Promise<Channel| null > {
        try {
          this.connection = await amqplib.connect(this.rabbitmqUrl);
          this.connection.on("error", (err) => {
            console.error("Error establishing connection:", err.message);
            this.reconnect();
          });
          this.connection.on("close", () => {
            console.error("Connection closed");
            this.reconnect();
          });
          this.channel = await this.connection.createChannel();
          console.log("Connected to RabbitMQ successfully");
          
          return this.channel
        } catch (err) {
          console.error("Failed to connect ot RabbitMQ:", err);
          console.log("Retrying in 5 seconds...");
          setTimeout(() => {
            this.connect();
          }, 5000);
        }
        return this.channel;
    }

    private async reconnect(): Promise<void> {
        if (this.channel) {
          await this.channel.close();
        }
        this.connection = null;
        this.channel = null;
        console.log("Reconnecting to RabbitMQ");
        await this.connect();
    }

    public async close(): Promise<void> {
        try {
          if (this.channel) {
            await this.channel.close();
          }
          if (this.connection) {
            await this.connection.close();
          }
    
          console.log("Disconnected from RabbitMQ");
        } catch (error) {
          console.error("Failed to disconnect from RabbitMQ:", error);
        }
    }
    // public async publishMessage(routingKey: string, message: any) {
    //     if (!this.channel) throw new Error("Channel is not initialized");
    //     this.channel.publish(
    //       exchangeName,
    //       routingKey,
    //       Buffer.from(JSON.stringify(message)),
    //       { persistent: true }
    //     );
    //     console.log(`Message sent to ${routingKey}`);
    //   }
}

export default RabbitMQ;