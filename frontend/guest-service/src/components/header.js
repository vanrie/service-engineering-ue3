import './header.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'

function Header() {

    return (
        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/login">Service Engineering 2023</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
               {(document.location.href != 'http://localhost:3000/login' &&  document.location.href != 'http://localhost:3000/register')? <a href="/login">Logout</a> : null}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Header;
