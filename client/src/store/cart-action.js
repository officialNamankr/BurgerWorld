import { cartActions } from "./cart-slice";
import { getToken } from "../utils/getToken";
import { uiActions } from "./ui-slice";
import { showNotification } from "./ui-actions";
import { displayNotification } from "../components/Notification";

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
      dispatch(
        uiActions.setNotification({
          status: null,
          title: null,
          message: null,
          isVisible: false,
        })
      );

      console.log("Inside fetchCartData");
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
      console.log("sent cart data completed");

      dispatch(
        showNotification({
          status: "success",
          title: "Success!",
          message: "cart updated successfully!",
          isVisible: true,
        })
      );

      //successNotification();
      // dispatch(
      // uiActions.setNotification({
      //   status: "success",
      //   title: "Success!",
      //   message: "Sent cart data successfully!",
      //   isVisible: true,
      // })
      // );
      // dispatch(
      //   uiActions.setNotification({
      //     status: null,
      //     title: null,
      //     message: null,
      //     isVisible: false,
      //   })
      // );
    } catch (error) {
      console.log(error);
      dispatch(
        showNotification({
          status: "error",
          title: "Error!",
          message: "Ooops! something went wrong",
          isVisible: true,
        })
      );

      // errorNotification();
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
