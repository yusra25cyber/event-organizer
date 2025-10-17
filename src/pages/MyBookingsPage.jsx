import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.jsx";

export default function MyBookingsPage() {
  const { user, authToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const apiUrl =
          "https://b37d9196-e0d4-4aa4-9d08-56491faf01a1-00-zcuh3tm471ep.sisko.replit.dev";
        const response = await fetch(`${apiUrl}/api/users/${user.id}/bookings`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleShowEditModal = (booking) => {
    setEditingBooking(booking);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingBooking(null);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      const apiUrl =
        "https://b37d9196-e0d4-4aa4-9d08-56491faf01a1-00-zcuh3tm471ep.sisko.replit.dev";
      const updatedData = {
        number_of_tickets: editingBooking.number_of_tickets,
        notes: editingBooking.notes,
      };
      const response = await fetch(
        `${apiUrl}/api/bookings/${editingBooking.booking_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        alert("Booking updated successfully!");
        const updatedBookingFromServer = await response.json();

        setBookings(
          bookings.map((b) =>
            b.booking_id === editingBooking.booking_id
              ? {
                  ...b,
                  number_of_tickets: updatedBookingFromServer.number_of_tickets,
                  notes: updatedBookingFromServer.notes,
                }
              : b
          )
        );
        handleCloseEditModal();
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("An error occurred while updating.");
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?😒")) {
      try {
        const apiUrl =
          "https://b37d9196-e0d4-4aa4-9d08-56491faf01a1-00-zcuh3tm471ep.sisko.replit.dev";
        const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Booking cancelled successfully.");
          setBookings(bookings.filter((b) => b.booking_id !== bookingId));
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel booking: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Hold on i am loading your bookings for you...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h1>My Bookings</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </Button>
        </Col>
      </Row>

      <Row>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Col key={booking.booking_id} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{booking.title}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong>{" "}
                    {new Date(booking.event_date).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong> {booking.location}
                  </Card.Text>
                  <Card.Text>
                    <strong>Tickets:</strong> {booking.number_of_tickets}
                  </Card.Text>
                  <Card.Text>
                    <strong>Notes:</strong> {booking.notes || "N/A"}
                  </Card.Text>
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => handleShowEditModal(booking)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCancel(booking.booking_id)}
                  >
                    Cancel
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>You have no bookings yet. go check some fun events bro </p>
        )}
      </Row>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking for "{editingBooking?.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingBooking && (
            <Form onSubmit={handleSaveChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Number of Tickets</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={editingBooking.number_of_tickets}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      number_of_tickets: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingBooking.notes || ""}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      notes: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseEditModal}
                className="ms-2"
              >
                Cancel
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
