import { Container, Row } from "react-bootstrap";
import OrderItem from "./Orderitem";
import Card from "react-bootstrap/Card";
import moment from "moment";
export const Orders = ({ order }) => {
  return (
    <Container>
      {order && order.length === 0 && <p>No order found</p>}
      {order.products && order.products.length > 0 && (
        <Row sm={1} md={1} lg={1}>
          <Container fluid className="mb-2">
            <Card className="">
              <Card.Body className="">
                <Container className="d-flex justify-content-between align-items-center bg-light">
                  <span className="fw-bold">Order Id: {order.id}</span>
                  <span className="fw-bold">
                    Order Date: {moment(order.date).format("DD/MM/YYYY")}
                  </span>
                  <span className="fw-bold">Order Status: {order.status}</span>
                  <span className="fw-bold">
                    Order Total: {"\u20B9"} {order.totalPrice}
                  </span>
                </Container>
                <Container className="d-flex flex-column justify-content-between align-items-center mt-2">
                  {order.products.map((product) => (
                    <OrderItem product={product} />
                  ))}
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </Row>
      )}
    </Container>
  );
};

export default Orders;
