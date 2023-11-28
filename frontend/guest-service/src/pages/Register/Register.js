import './Register.css';
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { createId } from '../../services/HelperService';
import { registerUser } from '../../services/UserService';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
  
    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      console.log(event, email, password);
      registerUser({email: email, password: password, firstName: firstName, lastName: lastName, id: createId(), isAdmin: false}).then((response) => {
            document.location.href = '/?hasJustRegistered=true' ;
            console.log('redirect to page');
        
      })
    }
    return (
        <div className="register">
            <h1>Jetzt registrieren!</h1>
            <Form onSubmit={handleSubmit} className="registerForm">
                <Form.Group size="lg" controlId="email" className='formGroup'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password" className='formGroup'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password" className='formGroup'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password" className='formGroup'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" type="submit" disabled={!validateForm()} className="registerButton">
                    Register
                </Button>
                <p>Bereits einen Account? <a href="/">Jetzt anmelden</a></p>
            </Form>

        </div>
    );
}

export default Register;
