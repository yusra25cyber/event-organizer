// src/pages/CreateEventPage.jsx - FINAL AND COMPLETE

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap"; // Corrected import
import { UserContext } from "../contexts/UserContext";
import { EVENTS_API_URL } from "../apiConfig";

export default function CreateEventPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State for all form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // State for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard clause: Ensure user is logged in
    if (!user?.id) {
      setError("Authentication error. Please log in again to create an event.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Assemble the data payload for the backend
      const eventData = {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        location,
        image_url: imageUrl,
        creator_id: user.id, // This is the crucial ownership link
      };

      // Send the data to your backend API
      const response = await fetch(`${EVENTS_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        // If the server responds with an error, try to parse it
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown server error occurred.");
      }

      //If successful:
      alert("Event created successfully!");
      navigate("/creator-hub"); // Redirect to the Creator Hub to see the new event
    } catch (serverError) {
      console.error("Server submission error:", serverError);
      setError(serverError.message);
    } finally {
      setIsLoading(false); //Ensure loading state is turned off, whether it succeeded or failed
    }
  };

  return (
    <Container className="py-5">
      <h1 className="display-5">Create a New Event</h1>
      <p className="lead text-muted">
        This is where your next great idea begins. Fill out the details below to
        put your event on the map.
      </p>

      <Form
        onSubmit={handleSubmit}
        className="mt-4 p-4 border rounded bg-light"
      >
        <Form.Group className="mb-3" controlId="eventTitle">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Summer Music Festival"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="eventDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Describe what makes your event special."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="eventTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="eventLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g., Central Park, New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="eventImageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Form.Text className="text-muted">
            Find an image on{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>{" "}
            and paste the link here.
          </Form.Text>
        </Form.Group>

        {/* Display any errors to the user */}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <div className="d-grid">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating Event..." : "Publish Event"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
