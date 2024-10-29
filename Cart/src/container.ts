import { Container } from "inversify";
import { Types } from "./types/types";
import RabbitMQService from "./rabbitmq.service";
import { CartService } from "./services/cart.service";
import { ProductService } from "./services/poduct.service";
import { ProductRepository } from "./repos/product.repo";
import { CartRepository } from "./repos/cart.repo";
import { CartController } from "./controllers/cart.controller";
import ProductUpdatedConsumer from "./events/product.updated.consumer";
import ProductCreatedConsumer from "./events/product.created.consumer";
import AuthCreatedConsumer from "./events/auth.created.consumer";

const container = new Container();


container.bind(CartController).toSelf();
container.bind(CartService).toSelf();
container.bind(ProductService).toSelf();
container.bind(ProductRepository).toSelf();
container.bind(CartRepository).toSelf();
container.bind(AuthCreatedConsumer).toSelf();


container.bind<RabbitMQService>(Types.RabbitMQService).toDynamicValue(async () => {
    return await RabbitMQService.getInstance();
}).inSingletonScope();

container.bind(ProductCreatedConsumer).toSelf();
container.bind(ProductUpdatedConsumer).toSelf();


export { container};