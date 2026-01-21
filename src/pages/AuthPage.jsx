import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
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

  // Background check: If user is already logged in, go to dashboard
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
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Sign In Failed.");
      setLoading(false);
    }
  };

  // --- EMAIL LOGIN/SIGNUP ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. CLIENT-SIDE VALIDATION (Check before sending to Firebase)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return; // Stop here! Don't talk to Firebase.
    }

    try {
      if (isLogin) {
        // Log In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // Force Redirect on Success
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      // 2. CLEAR ERROR MESSAGES
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please Log In instead.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Authentication failed. Please check your details.");
      }
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
              {isLogin ? "Welcome Back" : "Join Eventide"}
            </h2>
            <p className="text-white-50 small">
              {isLogin
                ? "Log in to continue"
                : "Create an account to get started"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="danger"
              className="text-center"
              style={{ fontSize: "0.9rem" }}
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleEmailAuth}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#d7ccc8" }}>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#d7ccc8" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <Form.Text className="text-white-50 small">
                  Must be at least 6 characters.
                </Form.Text>
              )}
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
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // Clear errors when switching
              }}
            >
              {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
