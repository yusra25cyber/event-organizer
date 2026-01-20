import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import UserProvider, { UserContext } from "./contexts/UserContext";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CreateEventPage from "./pages/CreateEventPage";
import CreatorHubPage from "./pages/CreatorHubPage";
import { AuthProvider } from "./components/AuthProvider";

function ProtectedRoutes() {
  const { authToken } = useContext(UserContext);
  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/create-event" element={<CreateEventPage />} />
              <Route path="/creator-hub" element={<CreatorHubPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
}
