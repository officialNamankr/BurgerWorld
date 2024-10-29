import mongoose, { version, Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Type } from "typescript";


interface category{
    id: Types.ObjectId;
    name: string;
}

export interface ProductAttrs {
    id: Types.ObjectId;
    title: string;
    price: number;
    description: string;
    category: category;
    image: string;
    discount: number;
    date: Date;
    countInStock: number
}

export interface ProductDoc extends mongoose.Document {
    id: Types.ObjectId;
    title: string;
    price: number;
    version: number;
    description: string;
    category: category;
    image: string;
    discount: number;
    date: Date;
    countInStock: number;
}
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
    findByEvent(event: {
        id: Types.ObjectId;
        version: number;
      }): Promise<ProductDoc | null>;
}
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    discount: {
        type: Number,
        required: true
    },
    category: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    countInStock: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.findByEvent =  async (event: { id: Types.ObjectId; version: number }) => {
    console.log(event);
    //event.version = event.version - 1;
    return await  Product.findOne({
      _id: event.id,
      version: event.version - 1,
    });
};

productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
        description: attrs.description,
        category: attrs.category,
        image: attrs.image,
        discount: attrs.discount,
        date: attrs.date,
        countInStock: attrs.countInStock
    });
}

const Product = mongoose.model<ProductDoc, ProductModel>("Products", productSchema);

export { Product };