import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';


function HomeLayout() {
  return (
    <Container>
        <Container className='flex-d justify-content-center align-items-center   text-center'>
        <h1>Welcome to Burger World</h1>
        </Container>
      
      <Outlet />
    </Container>
  );
}

export default HomeLayout;