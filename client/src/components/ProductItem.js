import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../store/cart-slice";
import { useNavigate } from "react-router-dom";
function ProductItem({ props }) {
  console.log("props");

  console.log(props);
  const { title, description, image, id, price } = props;

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  function addToCart() {
    if (!auth.isAuthenticated) {
      navigate("/?mode=login");
      return;
    }
    dispatch(
      cartActions.addItemToCart({
        id,
        title,
        price,
      })
    );
  }

  return (
    <Card className="mt-2" style={{ width: "16rem" }}>
      <Card.Img
        style={{ height: "200px" }}
        variant="top"
        src={image}
        alt={title}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description.substring(0, 20) + "..."}</Card.Text>
        <Button onClick={addToCart} className="btn btn-primary">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
export default ProductItem;
