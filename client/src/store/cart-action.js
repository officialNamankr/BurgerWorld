import { cartActions } from "./cart-slice";
import { getToken } from "../utils/getToken";

export const fetchCartData = () => {
  const token = getToken();
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch("https://burger-world.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const cartData = await fetchData();
      console.log(cartData);

      dispatch(
        cartActions.replaceCart({
          items: cartData.products || [],
          totalQuantity: cartData.totalQuantity,
          totalPrice: cartData.totalPrice,
        })
      );
    } catch (error) {
      console.log(error);
      //   dispatch(
      //     uiActions.showNotification({
      //       status: "error",
      //       title: "Error!",
      //       message: "Fetching cart data failed!",
      //     })
      //   );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    // dispatch(
    //   uiActions.showNotification({
    //     status: "pending",
    //     title: "Sending...",
    //     message: "Sending cart data!",
    //   })
    // );

    const sendRequest = async () => {
      const reqData = {
        products: cart.items
          .filter((item) => item.quantity > 0)
          .map((item) => {
            return {
              product: item.product.id,
              quantity: item.quantity,
            };
          }),
      };
      console.log("req Data");

      console.log(reqData);

      const response = await fetch("https://burger-world.com/api/cart/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(reqData),
      });
      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };

    try {
      await sendRequest();
      //   dispatch(
      //     uiActions.showNotification({
      //       status: "success",
      //       title: "Success!",
      //       message: "Sent cart data successfully!",
      //     })
      //   );
    } catch (error) {
      console.log(error);
      //   dispatch(
      //     uiActions.showNotification({
      //       status: "error",
      //       title: "Error!",
      //       message: "Sending cart data failed!",
      //     })
      //   );
    }
  };
};
