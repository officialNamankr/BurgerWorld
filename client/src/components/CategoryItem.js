import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CateogoryItem({props}) {
  return (
    <Card className="mt-2" style={{ width: '16rem' }}>
      <Card.Img variant="top" src="https://th.bing.com/th?id=OIP.8MJgw49NgTeBLs1BFzqS0gHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Explore </Button>
      </Card.Body>
    </Card>
  );
}

export default CateogoryItem;