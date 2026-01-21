import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
// 1. IMPORT FIREBASE FUNCTIONS
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { UserContext } from "../contexts/UserContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Navigation happens automatically via useEffect above
    } catch (err) {
      console.error(err);
      setError("Google Sign In Failed.");
      setLoading(false);
    }
  };

  // --- EMAIL LOGIN ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Log In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Navigation happens automatically via useEffect above
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        setError("Email already used.");
      else if (err.code === "auth/wrong-password") setError("Wrong password.");
      else if (err.code === "auth/user-not-found") setError("User not found.");
      else if (err.code === "auth/weak-password")
        setError("Password too weak.");
      else setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="p-4 shadow-lg bg-mocha"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#ffecb3" }}>
              {isLogin ? "Welcome Back" : "Join EventBooker"}
            </h2>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleEmailAuth}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#d7ccc8" }}>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#d7ccc8" }}>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              className="btn-luxury w-100 mb-3"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center text-white-50 mb-3">— OR —</div>

          <Button
            variant="light"
            className="w-100 mb-3"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Sign in with Google
          </Button>

          <div className="text-center">
            <span
              style={{
                color: "#ffecb3",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
