import './App.css';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import RootLayout from './pages/root';
import AuthPage from './pages/AuthPage';
import Home,{loader as loadCategories} from './pages/Home';
import { action as authAction } from './pages/AuthPage';
import {Logout} from './pages/Logout';
import AuthGuard from './utils/authGuard';
import ProductsPage, {loader as loadProducts} from './pages/ProductsPage';
import HomeLayout from './pages/HomeLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (<AuthGuard><AuthPage /></AuthGuard>),
        action: authAction
      },
      {
        path: "home",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <Home />,
            loader:loadCategories
          },
          {
            path: ":id",
            element: <ProductsPage />,
            loader:loadProducts
          },
        ],
      },
      {
        path: "logout",
        element: <Logout />,
      }
    ],
  },
]);

function App() {
  return (
   <RouterProvider router={router} />
  );
}

export default App;
