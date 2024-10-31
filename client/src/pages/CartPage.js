import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { defer, json, Await } from "react-router-dom";
import Cart from "../components/Cart/Cart";
function CartPage() {
  const Auth = useSelector((state) => state.auth);
  const cartData = useSelector((state) => state.cart);
  const isLogin = Auth.isAuthenticated;
  // const { cartData } = useLoaderData();

  const navigate = useNavigate();

  console.log("Cart Data");
  console.log(cartData);

  useEffect(() => {
    if (!isLogin) {
      navigate("/?mode=login");
    }
  }, [isLogin, navigate]);

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={cartData}>
          {(loadedCartData) => {
            console.log(loadedCartData);
            return <Cart cartData={loadedCartData} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
export default CartPage;

async function getCart() {
  console.log("Load cart");

  const response = await fetch("https://burger-world.com/api/cart");
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    return json(data, { status: response.status });
  }
  return data;
}

export function loader() {
  return defer({
    cartData: getCart(),
  });
}
