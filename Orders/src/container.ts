import { Container } from "inversify";
import { OrderRepository } from "./repos/Order.repo";
import { OrderService } from "./services/Order.service";
import RabbitMQService  from "./rabbitmq.service";
import { Types } from "./types/types";
import ProductConsumer from "./events/product.created.consumer";
import { OrderController } from "./controllers/Order.controller";
import { ProductRepository } from "./repos/Product.repo";
import { ProductService } from "./services/Product.service";
import ProductUpdatedConsumer from "./events/product.updated.consumer";

const container = new Container();
container.bind(OrderController).toSelf();
container.bind(OrderRepository).toSelf();
container.bind(OrderService).toSelf();

container.bind(ProductRepository).toSelf();
container.bind(ProductService).toSelf();
container.bind<RabbitMQService>(Types.RabbitMQService).toDynamicValue(async () => {
    const rabbitMQUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    return await RabbitMQService.getInstance(rabbitMQUrl);
}).inTransientScope();

// container.bind<ProductConsumer>(Types.ProductConsumer).to(ProductConsumer);
container.bind(ProductConsumer).toSelf();
container.bind(ProductUpdatedConsumer).toSelf();



export { container};