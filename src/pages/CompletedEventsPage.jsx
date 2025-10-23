// src/pages/CompletedEventsPage.jsx
import { Container } from "react-bootstrap";

export default function CompletedEventsPage() {
  return (
    <Container className="py-5">
      <h1>Archive: Completed Events</h1>
      <p>
        A record of your past successes. This page will show events whose dates
        have passed.
      </p>
    </Container>
  );
}
