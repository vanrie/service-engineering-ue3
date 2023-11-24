import './header.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container'

function Header() {
    const dummyUser = {
        _id: 1,
        firstName: 'Asda',
        lastName: 'Asda',
        email: 'Asdd',
        isAdmin: true,
    }
    return (
        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Service Engineering 2023</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Hallo <a href="#login">{dummyUser.firstName} {dummyUser.lastName}</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Header;
