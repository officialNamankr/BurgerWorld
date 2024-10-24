import { Col, Container, Row } from "react-bootstrap";
import ProductItem from "./ProductItem";
 const Products = ({ products }) => {

    return (
        <>
        {products && products.length === 0 && <p>No products found</p>}
        {products && products.length > 0 &&<Row sm={1} md={2} lg={4}  >
            {products.map((product) => (
            <Col>
                <ProductItem key={product.id} props={product} />
            </Col>
            ))}
        
        </Row>}
        </>
    );
}


export default Products;
