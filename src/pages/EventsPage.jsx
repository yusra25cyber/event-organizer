// src/pages/EventsPage.jsx - REFACTORED AND IMPROVED

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";
import { EVENTS_API_URL } from "../apiConfig"; // Use our centralized API config

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext); // We get the user directly from our context

  // fetch events from the api
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${EVENTS_API_URL}/api/events`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []); // The dependency array is empty because this page is already protected by the router

  const handleBook = async (eventId, eventTitle) => {
    if (!user || !user.id) {
      alert("Could not verify user. Please try logging in again.");
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        event_id: eventId,
        number_of_tickets: 1, // Default to 1 ticket
        notes: "",
      };

      const response = await fetch(`${EVENTS_API_URL}/api/bookings`, {
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

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading upcoming events...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h1 className="display-5">Explore Upcoming Events</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Col>
      </Row>

      <Row>
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={
                    event.image_url ||
                    "https://via.placeholder.com/400x250.png?text=Event+Image"
                  }
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text className="text-muted small">
                    {new Date(event.event_date).toLocaleDateString()} at{" "}
                    {event.location}
                  </Card.Text>
                  <Card.Text style={{ flexGrow: 1, fontSize: "0.9rem" }}>
                    {event.description.substring(0, 100)}...
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => handleBook(event.id, event.title)}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No upcoming events found. Check back soon!</p>
        )}
      </Row>
    </Container>
  );
}
