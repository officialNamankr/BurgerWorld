import {
  InputGroup,
  FormControl,
  FormGroup,
  CardGroup,
  Container,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";

function CartItem({ cartItem }) {
  const dispatch = useDispatch();
  const handleIncrement = () => {
    dispatch(
      cartActions.addItemToCart({
        id: cartItem.product.id,
        title: cartItem.product.title,
        price: cartItem.product.price,
      })
    );
  };

  const handleDecrement = () => {
    dispatch(
      cartActions.removeItemFromCart({
        id: cartItem.product.id,
        title: cartItem.product.title,
        price: cartItem.product.price,
      })
    );
  };

  console.log(cartItem);
  return (
    <Container fluid className="mb-2">
      <Card className="">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <CardGroup>
            <Card.Title>{cartItem.product.title}</Card.Title>
          </CardGroup>
          <CardGroup className="d-flex justify-content-between">
            <InputGroup className="mb-3">
              <Button variant="outline-secondary" onClick={handleDecrement}>
                -
              </Button>
              <FormControl
                type="text"
                value={cartItem.quantity}
                //onChange={(e) => setQuantity(Number(e.target.value))}
                className="text-center"
                readOnly
              />
              <Button variant="outline-secondary" onClick={handleIncrement}>
                +
              </Button>
            </InputGroup>
          </CardGroup>
          <CardGroup>
            <span>
              {cartItem.product.price} X {cartItem.quantity} =
            </span>
            <Card.Text className=" mx-3 fw-bold">${cartItem.price}</Card.Text>
          </CardGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CartItem;
