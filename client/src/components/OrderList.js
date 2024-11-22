import Orders from "./Orders";

function OrderList({ orders }) {
  console.log("Orders list");
  console.log(orders);

  return (
    <ul>
      {orders.map((order) => (
        <Orders key={order.id} order={order} />
      ))}
    </ul>
  );
}

export default OrderList;
