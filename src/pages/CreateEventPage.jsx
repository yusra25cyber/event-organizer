// src/pages/CreateEventPage.jsx - EMERGENCY VERSION

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext";
import { EVENTS_API_URL } from "../apiConfig"; // Make sure this path is correct

export default function CreateEventPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError("You must be logged in to create an event.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const eventData = {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        location,
        image_url: imageUrl,
        creator_id: user.id,
      };

      const response = await fetch(`${EVENTS_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event.");
      }

      alert("Event created successfully!");
      navigate("/creator-hub"); // Redirect after success
    } catch (serverError) {
      console.error("Server error:", serverError);
      setError(serverError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1>Create a New Event</h1>
      <p className="lead">
        Fill out the details below to bring your event to life.
      </p>

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
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

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Find an image on Unsplash.com and paste the URL here"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
      </Form>
    </Container>
  );
}
