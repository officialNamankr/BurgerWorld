import { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCurrentUser } from '../store/auth-actions';


function MainNavigation() {

  const Auth = useSelector((state) => state.auth);
  const isLogin = Auth.isAuthenticated;
  const user = Auth.user;

  // const isLogin = localStorage.getItem("isAuthenticated") === "true"; 
  // const user = localStorage.getItem("email");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // const role = Auth.role;
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand ><Link className="text-decoration-none fw-bold text-dark" to="/home">Burger World</Link></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end"> 
        {isLogin &&
          <Navbar.Text>
            Signed in as: {user}
          </Navbar.Text>}
          {isLogin &&
          <Navbar.Text>
            <Link to="logout">Logout</Link>
          </Navbar.Text>}
          {!isLogin &&
          <Navbar.Text>
            <Link to="/?mode=login">Login</Link>
          </Navbar.Text>}
          {!isLogin &&
          <Navbar.Text className='ms-3'>
            <Link to="/?mode=signup">Sign Up</Link>
          </Navbar.Text>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default MainNavigation;