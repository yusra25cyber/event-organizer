import { Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../components/AuthProvider";

export default function AuthPage() {
  const [modalShow, setModalShow] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const googleProvider = new GoogleAuthProvider();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Email + password signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setModalShow(null);
    } catch (error) {
      console.error("Signup Error:", error.message);
    }
  };

  // Email + password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setModalShow(null);
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  // Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setModalShow(null);
    } catch (error) {
      console.error("Google Sign-in Error:", error.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4)
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glass Card */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          padding: "3rem",
          borderRadius: "1rem",
          textAlign: "center",
          color: "white",
          width: "340px",
        }}
      >
        <h1 className="mb-4">Eventide</h1>
        <p className="mb-4 text-white-50">
          Create, discover, and manage unforgettable events.
        </p>

        <Button
          size="lg"
          className="w-100 mb-3"
          onClick={() => setModalShow("signup")}
        >
          Get Started
        </Button>

        <Button
          variant="link"
          className="text-white-50"
          onClick={() => setModalShow("login")}
        >
          Already have an account? Sign In
        </Button>
      </div>

      {/* Modal */}
      <Modal
        show={modalShow !== null}
        onHide={() => setModalShow(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalShow === "signup" ? "Create Account" : "Welcome Back"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Google Sign-in */}
          <Button
            variant="outline-dark"
            className="w-100 mb-3 d-flex align-items-center justify-content-center"
            onClick={handleGoogleSignIn}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: "18px", marginRight: "10px" }}
            />
            Continue with Google
          </Button>

          <hr />

          {/* Email Form */}
          <Form onSubmit={modalShow === "signup" ? handleSignUp : handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100">
              {modalShow === "signup" ? "Sign Up" : "Log In"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
