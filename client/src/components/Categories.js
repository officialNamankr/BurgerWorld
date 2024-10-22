import { Col, Container, Row } from "react-bootstrap";
import CateogoryItem from "./CategoryItem";
export const Categories = () => {

    const categories = [
        {
            id: 1,
            name: "Burgers",},

        {
            id: 2,
            name: "Pizzas",},

        {
            id: 3,
            name: "Sides",},
        {
            id: 4,
            name: "Sides",},
        {
            id: 5,
            name: "Sides",},
        {
            id: 6,
            name: "Sides",},
        {
            id: 7,
            name: "Sides",},
        {
            id: 8,
            name: "Sides",},
    ];

    return (
        <Container>
        <Row sm={1} md={2} lg={4}  >
            {categories.map((category) => (
            <Col>
                <CateogoryItem key={category.id} props={category} />
            </Col>
            ))}
            
        </Row>
        </Container>
    );
}