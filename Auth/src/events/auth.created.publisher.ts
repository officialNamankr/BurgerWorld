import RabbitMQService from "../rabbitmq.service";

export default class UserCreatedPublisher {
    private amqpService: RabbitMQService;
    constructor(rabbitmqInstance: RabbitMQService) {
        this.amqpService = rabbitmqInstance;
    }
    async publish(user: any,exchange: string, routingKey: string) {
        console.log("Publishing user: ", user);
        console.log("Exchange: ", exchange);
        console.log("Routing key: ", routingKey);  
    try {
        await this.amqpService.publishMessage(
            exchange,
            routingKey,
            JSON.stringify(user)
        );
    } catch (err) {
        console.log("Error publishing User: ", err);
        console.log(err);
    }
}}