import RabbitMQService from "../services/rabbitmqService";

export default class ProductPublisher {
    private amqpService: RabbitMQService;
    constructor() {
        this.amqpService = new RabbitMQService();
    }
    async publish(product: any,exchange: string) {
        console.log("Publishing product: ", product);
        console.log("Exchange: ", exchange);
        // console.log("Routing key: ", routingKey);  
    try {
        await this.amqpService.publishMessage(
            exchange,
            JSON.stringify(product)
        );
    } catch (err) {
        console.log("Error publishing product: ", err);
        console.log(err);
    }
}}