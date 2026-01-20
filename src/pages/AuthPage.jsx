import { Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AUTH_API_URL } from "../apiConfig";
import { UserContext } from "../contexts/UserContext.jsx";
import { useContext } from "react";

export default function AuthPage() {
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { authToken, setAuthToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/dashboard");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${AUTH_API_URL}/signup`, {
        username,
        email,
        phone_number: phoneNumber,
        password,
      });

      await handleLogin(e, true);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleLogin = async (e, isAfterSignup = false) => {
    if (!isAfterSignup) e.preventDefault();
    try {
      const res = await axios.post(`${AUTH_API_URL}/login`, {
        username,
        password,
      });
      if (res.data?.auth && res.data?.token) {
        setAuthToken(res.data.token);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleClose = () => setModalShow(null);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=1931&auto=format&fit=crop)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="text-center text-white p-5"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          maxWidth: "500px",
        }}
      >
        <i
          className="bi bi-calendar2-heart-fill"
          style={{ fontSize: "4rem", color: "#fff" }}
        ></i>
        <h1 className="display-4 my-4">Eventide</h1>
        <p className="lead mb-5">
          Your portal to unforgettable experiences. Create, discover, and
          connect.
        </p>
        <div className="d-grid gap-2">
          <Button size="lg" className="rounded-pill" onClick={handleShowSignUp}>
            Get Started
          </Button>
          <Button
            variant="link"
            className="text-white-50"
            onClick={handleShowLogin}
          >
            Already have an account? Sign In
          </Button>
        </div>
      </div>

      <Modal show={modalShow !== null} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalShow === "SignUp" ? "Create Your Account" : "Welcome Back"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="d-grid gap-2"
            onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
          >
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                required
              />
            </Form.Group>
            {modalShow === "SignUp" && (
              <>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                  />
                </Form.Group>
              </>
            )}
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </Form.Group>
            <Button className="rounded-pill mt-3" type="submit">
              {modalShow === "SignUp" ? "Sign Up" : "Log In"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
