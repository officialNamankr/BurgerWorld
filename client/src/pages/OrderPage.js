import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import OrderList from "../components/OrderList";
import { json, defer } from "react-router-dom";

function OrderPage() {
  const { orders } = useLoaderData();
  console.log("Orders");
  console.log(orders);

  return (
    <div>
      <h1>Your Orders</h1>
      {/* {categories && categories.length === 0 && <p>No categories found</p>} */}
      <Suspense fallback={<p>Fetching your orders...</p>}>
        <Await resolve={orders}>
          {(loadedOrders) => <OrderList orders={loadedOrders} />}
        </Await>
      </Suspense>
    </div>
  );
}

export default OrderPage;

async function getOrders() {
  console.log("loadOrders");

  const response = await fetch("https://burger-world.com/api/orders");
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    return json(data, { status: response.status });
  }
  return data;
}

export function loader() {
  return defer({
    orders: getOrders(),
  });
}
