import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/root";
import AuthPage from "./pages/AuthPage";
import Home, { loader as loadCategories } from "./pages/Home";
import { action as authAction } from "./pages/AuthPage";
import { Logout } from "./pages/Logout";
import AuthGuard from "./utils/authGuard";
import ProductsPage, { loader as loadProducts } from "./pages/ProductsPage";
import HomeLayout from "./pages/HomeLayout";
import CartPage, { loader as loadCart } from "./pages/CartPage";
import { useEffect, useRef, useState } from "react";
import { fetchCartData, sendCartData } from "./store/cart-action";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { showNotification } from "./store/ui-actions";
import { displayNotification } from "./components/Notification";
import { uiActions } from "./store/ui-slice";

let isInitial = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <AuthGuard>
            <AuthPage />
          </AuthGuard>
        ),
        action: authAction,
      },
      {
        path: "home",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <Home />,
            loader: loadCategories,
          },
          {
            path: ":id",
            element: <ProductsPage />,
            loader: loadProducts,
          },
        ],
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "cart",
        element: <CartPage />,
        //loader: loadCart,
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const notificationData = useSelector((state) => state.ui);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    if (cart.changed) {
      console.log("Sending cart data...");
      dispatch(sendCartData(cart));
    }
  }, [dispatch, cart]);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // useEffect(() => {
  //   if (notificationData.notificationVisible) {
  //     console.log("notificationData in app.js");
  //     console.log(notificationData);
  //     displayNotification(notificationData);

  //   }
  // }, [notificationData]);

  return <RouterProvider router={router} />;
}

export default App;
