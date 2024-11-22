import { Container, Row, Col, Button } from "react-bootstrap";
import CartItem from "./CartItem";

function Cart({ cartData }) {
  return (
    <Container className="mt-5 mb-5">
      <h1 className="text-center">Cart</h1>
      <Container>
        {!cartData && cartData.items.length === 0 && <p>Cart is empty</p>}
        {cartData && cartData.items.length > 0 && (
          <Row sm={1} md={1} lg={1}>
            {cartData.items.map((item) => (
              <Col>
                <CartItem key={item.product.id} cartItem={item} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Container fluid className="mt-5 bg-light">
        <Row className="d-flex justify-content-between align-items-center p-2">
          <Col className="d-flex justify-content-start">
            <h3>Total</h3>
          </Col>
          <Col className="d-flex justify-content-end">
            <h3>{cartData && cartData.totalPrice}</h3>
          </Col>
        </Row>
      </Container>
      <Container className="mt-5 d-flex justify-content-center align-items-center">
        <Button variant="success">Checkout</Button>
      </Container>
    </Container>
  );
}

export default Cart;
