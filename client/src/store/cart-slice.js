import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    // totalQuantity: 0,
    changed: false,
  },
  reducers: {
    replaceCart(state, action) {
      console.log("replacing cart");

      state.totalPrice = action.payload.totalPrice;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      console.log("add item to cart action");
      console.log(newItem);

      const existingItem = state.items.find(
        (item) => item.product.id === newItem.id
      );

      //   state.totalQuantity++;
      state.changed = true;
      if (!existingItem) {
        console.log("new item added");

        state.items.push({
          product: {
            id: newItem.id,
            title: newItem.title,
            price: newItem.price,
          },
          price: newItem.price,
          quantity: 1,
          //   totalPrice: newItem.price,
          //   name: newItem.title,
        });

        state.totalPrice = state.totalPrice + newItem.price;
      } else {
        existingItem.quantity++;
        existingItem.price = existingItem.product.price * existingItem.quantity;
        state.totalPrice = state.totalPrice + newItem.price;
        // existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload.id;
      const existingItem = state.items.find((item) => item.product.id === id);
      if (existingItem) {
        console.log("remove item from cart action");
        console.log(existingItem);
        state.totalQuantity--;
        state.totalPrice = state.totalPrice - action.payload.price;
        state.changed = true;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.product.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice =
            existingItem.totalPrice - existingItem.price;
        }
      }
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
