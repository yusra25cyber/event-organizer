import { Button, Col, Image, Row, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const loginImage =
    "https://media.istockphoto.com/id/1448698612/photo/diversity-hands-and-team-above-in-support-trust-and-unity-for-collaboration-agreement-or.jpg?s=612x612&w=0&k=20&c=gGqdVAEvyopmhqELxQ1tgrqXZkCmHWi5nCleGGDuHJU=";

  const url =
    "https://97d892e5-fd2f-4991-ae77-726bce5900b5-00-10vsuv10ma3hz.sisko.replit.dev";

  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/events");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/signup`, {
        username,
        email,
        phone_number,
        password,
      });
      console.log(res.data);

      handleLogin(e, true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e, isAfterSignup = false) => {
    if (!isAfterSignup) e.preventDefault();
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      if (res.data && res.data.auth === true && res.data.token) {
        setAuthToken(res.data.token);
        console.log("Login was successful, token saved");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setModalShow(null);

  return (
    <Row>
      <Col sm={7}>
        <Image height="800px" src={loginImage} fluid />
      </Col>
      <Col sm={5} className="p-4">
        <i
          className="bi bi-calendar-event"
          style={{ fontSize: 50, color: "dodgerblue" }}
        ></i>

        <p className="mt-5" style={{ fontSize: 64 }}>
          Gather. Connect. Experience.
        </p>
        <h2 className="my-5" style={{ fontSize: 31 }}>
          Book your next experience today.
        </h2>
        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{ fontSize: "12px" }}>
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>

          <p className="mt-5" style={{ fontWeight: "bold" }}>
            Already have an account?
          </p>
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign in
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp"
                ? "Create your account"
                : "Log in to your account"}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter username"
                />
              </Form.Group>

              {modalShow === "SignUp" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setPhone_number(e.target.value)}
                      type="text"
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Button className="rounded-pill" type="submit">
                {modalShow === "SignUp" ? "Sign up" : "Log in"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
