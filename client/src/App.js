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
import { useEffect, useState } from "react";
import { fetchCartData, sendCartData } from "./store/cart-action";
import { useDispatch, useSelector } from "react-redux";

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
  const [cartLoaded, setCartLoaded] = useState(false);
  useEffect(() => {
    dispatch(fetchCartData()).then(() => setCartLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    if (cartLoaded) {
      dispatch(sendCartData(cart));
    }
  }, [dispatch, cart, cartLoaded]);

  return <RouterProvider router={router} />;
}

export default App;
