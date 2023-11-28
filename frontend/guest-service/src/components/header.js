import './header.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'

function Header() {

    return (
        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Service Engineering 2023</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
               {document.location.href == 'http://localhost:3000/dashboard' ? <a href="/">Logout</a> : null}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Header;
