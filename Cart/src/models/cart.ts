import mongoose from 'mongoose';
import { ProductDoc } from './products';
import { CartProdcutAttrs } from '../interfaces/Cart.Dto';
import { Types } from 'mongoose';
 export interface CartAttrs {
    userId: Types.ObjectId;
    products: CartProdcutAttrs[] | [];
}

export interface CartDoc extends mongoose.Document {
    userId: Types.ObjectId;
    products: CartProdcutAttrs[] | [];
}

interface CartModel extends mongoose.Model<CartDoc> {
    build(attrs: CartAttrs): CartDoc;
}

export interface CartProduct{
    product: Types.ObjectId;
    quantity: number;
}

const cartProductSchema = new mongoose.Schema<CartProduct>({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
  },{
    _id: false
  });
  


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products:{
        type: [cartProductSchema],
        default: [],
},
    date: {
        type: Date,
        default: Date.now
    }
});

cartSchema.statics.build = (attrs: CartAttrs) => {
    return new Cart(attrs);
}

const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema);

export { Cart };