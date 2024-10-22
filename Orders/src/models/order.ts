import mongoose from "mongoose";
import { Product, ProductDoc } from "./product";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@burger-world.com/common";
export interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    products: {
        product: ProductDoc;
        quantity: number;
        price: number;
    }[];
    discount: number;
    date: Date;
}

interface OrderDoc extends mongoose.Document {
    id: string;
    userId: string;
    status: OrderStatus;
    version: number;
    products: {
        product: ProductDoc;
        quantity: number;
        price: number;
    }[];
    discount: number;
    date: Date;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    products: [{
        product: {
            ref : "Products",
            type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    date: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.set('versionKey', 'version');
orderSchema.set('timestamps', true);
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.virtual('totalPrice').get(function() {
    let total = this.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);
    return total - ((this.discount / 100) * total);

});

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };