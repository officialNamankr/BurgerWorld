import React, { useEffect }  from 'react';
import { Form as BootstrapForm, Button, Card, Container, Row, Col } from 'react-bootstrap';
import "./Login.module.css";
import {Form, Link, redirect, useActionData, useNavigation, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AuthForm() {
    const navigation = useNavigation();
    const data = useActionData();

    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';
    const isSubmitting = navigation.state === 'submitting';

  console.log("data");
  
  console.log(data);
  
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg p-4 rounded-lg">
            <Card.Body>
              <h3 className="text-center mb-4">{isLogin ? 'Login' : 'Sign Up'}</h3>
              {data && data.errors && (
                <ul>
                  {Object.values(data.errors).map((err) => (
                    <li style={{ color: 'red' }} key={err.message}>{err.message}</li>
                  ))}
                </ul>
              )}
              {data && data.message && <p>{data.message}</p>}
              <Form method="post">
                <BootstrapForm.Group controlId="email">
                  <BootstrapForm.Label>Email address</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="email"
                    placeholder="Enter your email"
                    name ="email"
                    // value={}
                    // onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </BootstrapForm.Group>
                {!isLogin && <BootstrapForm.Group controlId="name" className="mt-3">
                  <BootstrapForm.Label>Name</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="text"
                    placeholder="Enter you name"
                    name ="name"
                    // value={confirmPassword}
                    // onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </BootstrapForm.Group>}

                <BootstrapForm.Group  controlId="password" className="mt-3">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="password"
                    placeholder="Enter your password"
                    name ="password"
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </BootstrapForm.Group>

                {!isLogin && <BootstrapForm.Group controlId="confirmPassword" className="mt-3">
                  <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="password"
                    placeholder="Confirm your password"
                    name ="passwordConfirm"
                    // value={confirmPassword}
                    // onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control-lg"
                  />
                </BootstrapForm.Group>}
                <div>
                    
                <Button 
                  disabled={isSubmitting}
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 btn-lg"
                  style={{
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Save'}
                </Button>
                <div className="w-100 mt-1 d-flex justify-content-center align-items-center">
                  <span>
                <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
                      {isLogin ? 'Create new account' : 'Already have an account?'}
                    </Link>
                  </span>
                </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthForm;
