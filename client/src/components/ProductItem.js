import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function ProductItem({ props }) {

  function addToCart() {
    console.log("Add to cart");
  }

  return (
    <Card className="mt-2" style={{ width: '16rem'}}>
      <Card.Img  style={{ height: '200px' }} variant="top" src = {props.image} alt={props.title} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.description.substring(0, 20)+'...'}
        </Card.Text>
        <Button onClick={addToCart} className="btn btn-primary">Add to Cart</Button>
      </Card.Body>
    </Card>
  );
}
export default ProductItem;