import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";

export default function EventsPage() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);
  // redirect the user to login page
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);
  // fetch events from the api when one person has logged in successfully
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl =
          "https://b37d9196-e0d4-4aa4-9d08-56491faf01a1-00-zcuh3tm471ep.sisko.replit.dev";
        const response = await fetch(`${apiUrl}/api/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    if (authToken) {
      fetchEvents();
    }
  }, [authToken]);

  // remove the token from local storage wen person clicks logout

  const handleLogout = () => {
    setAuthToken("");
  };

  const handleBook = async (eventId, eventTitle) => {
    if (!user || !user.id) {
      alert("Could not verify user. Please try logging in again.");
      return;
    }

    try {
      const apiUrl =
        "https://b37d9196-e0d4-4aa4-9d08-56491faf01a1-00-zcuh3tm471ep.sisko.replit.dev";

      const bookingData = {
        user_id: user.id,
        event_id: eventId,
        number_of_tickets: 1,
        notes: "",
      };

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert(`Successfully booked your spot for "${eventTitle}"!`);
        navigate("/my-bookings");
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.error || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error booking event:", error);
      alert("An error occurred. Please check your connection and try again.");
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h1>Upcoming Events</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </Button>
          <Button variant="danger" onClick={handleLogout} className="ms-2">
            Logout
          </Button>
        </Col>
      </Row>

      <Row>
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    event.image_url ||
                    "https://media.istockphoto.com/id/1409304190/photo/embroidered-red-pins-on-a-calendar-event-planner-calendar-clock-to-set-timetable-organize.webp?a=1&b=1&s=612x612&w=0&k=20&c=RWNT_F2DROAeaYwro652G6k5NWBvdRvFND7424nXnd8="
                  }
                />
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <Card.Text>
                    <strong>Date:</strong>{" "}
                    {new Date(event.event_date).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {event.location}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleBook(event.id, event.title)}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Loading the upcoming events...</p>
        )}
      </Row>
    </Container>
  );
}
