import mongoose, { version } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export interface ProductAttrs {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    discount: number;
    date: Date;
}

export interface ProductDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    description: string;
    image: string;
    discount: number;
    date: Date;
}
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
    findByEvent(event: {
        id: string;
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



productSchema.statics.findByEvent =  async (event: { id: string; version: number }) => {
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
        image: attrs.image,
        discount: attrs.discount
    });
}

const Product = mongoose.model<ProductDoc, ProductModel>("Products", productSchema);

export { Product };