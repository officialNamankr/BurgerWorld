import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ProductAttrs {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    countInStock: number;
    discount: number;
}

interface ProductDoc extends mongoose.Document {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    countInStock: number;
    avgRating: number;
    numReviews: number;
    discount: number;
    version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
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
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    avgRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        virtuals: true
    },
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
        virtuals: true
    }
});
productSchema.plugin(updateIfCurrentPlugin);
productSchema.set("versionKey", "version");
productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

productSchema.virtual('discountedPrice').get(function() {
    return this.price - ((this.discount / 100)*this.price);
});
// productSchema.set('toJSON', { virtuals: true });
// productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model<ProductDoc,ProductModel>("Products",productSchema);

export { Product };