// ErrorPage.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const ErrorPage = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-4">404</h1>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="lead">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button variant="primary" href="/">
            Go Back Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
