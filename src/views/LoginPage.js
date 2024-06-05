import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container>
            <h1 className="my-3">Login to your account</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a href="/signup">Sign up for an account</a>
                </Form.Group>
                <Button variant="primary" onClick={async (e) => {
                    e.preventDefault();
                    setError("");
                    const canLogin = username && password;
                    if (canLogin) {
                        try {
                            await signInWithEmailAndPassword(auth, username, password);
                            navigate("/");
                        } catch (error) {
                            setError(error.message);
                        }
                    }
                }}>
                    Login
                </Button>
                <Button variant="danger" className="ms-2" onClick={handleGoogleLogin}>
                    Login with Google
                </Button>
            </Form>
            {error && <p className="text-danger">{error}</p>}
        </Container>
    );
}
