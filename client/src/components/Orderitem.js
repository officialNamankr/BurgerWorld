import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Container from "react-bootstrap/Container";

function OrderItem({ product }) {
  return (
    <Container
      fluid
      className="d-flex justify-content-between align-items-center"
    >
      <Card.Text className="mx-3 fw-bold">{product.product.title}</Card.Text>
      <Card.Text className="mx-3 fw-bold">
        {"\u20B9"} {product.product.price}X{product.quantity}
      </Card.Text>
      <Card.Text className="mx-3 fw-bold">
        {"\u20B9"} {product.price}
      </Card.Text>
    </Container>
  );
}

export default OrderItem;
