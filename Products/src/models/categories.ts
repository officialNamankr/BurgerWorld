import mongoose from "mongoose";

interface CategoryAttrs {
    name: string;
    description: string;
    image: string;
}

export interface CategoryDoc extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc
}

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
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
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>("Categories", categorySchema);

export { Category };
