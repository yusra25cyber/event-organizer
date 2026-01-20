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
import { EVENTS_API_URL } from "../apiConfig";

export default function MyBookingsPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${EVENTS_API_URL}/api/users/${user.id}/bookings`
        );
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
      const updatedData = {
        number_of_tickets: editingBooking.number_of_tickets,
        notes: editingBooking.notes,
      };
      const response = await fetch(
        `${EVENTS_API_URL}/api/bookings/${editingBooking.booking_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings(
          bookings.map((b) =>
            b.booking_id === editingBooking.booking_id
              ? { ...b, ...updatedBooking }
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
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          `${EVENTS_API_URL}/api/bookings/${bookingId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setBookings(bookings.filter((b) => b.booking_id !== bookingId));
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel booking: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your bookings...</p>
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
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
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
          <p>You have no bookings yet. Go explore some events!</p>
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
                Close
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
