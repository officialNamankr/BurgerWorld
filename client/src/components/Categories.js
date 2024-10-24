import { Col, Container, Row } from "react-bootstrap";
import CateogoryItem from "./CategoryItem";
export const Categories = ({ categories }) => {

    return (
        <Container>
        {categories && categories.length === 0 && <p>No categories found</p>}
        {categories && categories.length > 0 &&<Row sm={1} md={2} lg={4}  >
            {categories.map((category) => (
            <Col>
                <CateogoryItem key={category.id} props={category} />
            </Col>
            ))}
        
        </Row>}
        </Container>
    );
}