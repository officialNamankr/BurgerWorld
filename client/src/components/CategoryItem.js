import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function CateogoryItem({ props }) {
  return (
    <Card className="mt-2" style={{ width: '16rem'}}>
      <Card.Img  style={{ height: '200px' }} variant="top" src={props.image} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          {props.description.substring(0, 20)+'...'}
        </Card.Text>
        <Link type='button' to={`/home/${props.id}`} className="btn btn-primary">Explore </Link>
      </Card.Body>
    </Card>
  );
}

export default CateogoryItem;