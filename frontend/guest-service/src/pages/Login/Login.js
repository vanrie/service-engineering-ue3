import './Login.css';
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { login } from '../../services/UserService';
import { useSearchParams } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [searchParams] = useSearchParams();

    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      console.log(event, email, password);
      login({email: email, password: password}).then((response) => {
        console.log(response);
        if(response.data._id){
            document.location.href = '/dashboard' + '?userId=' + response.data.id;
            console.log('redirect to page');
        }
      })
    }
    return (
        <div className="login">
            <h1>Bitte loggen Sie sich ein!</h1>
            {searchParams.get('hasJustRegistered') ? <p className="snackbar"> Sie haben sich erfolgreich registriert, bitte loggen sie sich jetzt ein!</p> : null}
            <Form onSubmit={handleSubmit} className="loginForm">
                <Form.Group size="lg" controlId="email" className="formGroup">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password" className="formGroup">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button className="loginButton" block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
                <p>Noch keinen Account? <a href="/register">Jetzt registrieren</a></p>
            </Form>

        </div>
    );
}

export default Login;
