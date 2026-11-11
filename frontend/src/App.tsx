import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import StallList from "./pages/StallList";
import StallDetail from "./pages/StallDetail";
import StallForm from "./pages/StallForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  const { pathname } = useLocation();
  // halaman login & register punya tata letak penuh sendiri, tanpa navbar
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<StallList />} />
        <Route
          path="/stalls/new"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <StallForm />
            </ProtectedRoute>
          }
        />
        <Route path="/stalls/:id" element={<StallDetail />} />
        <Route
          path="/stalls/:id/edit"
          element={
            <ProtectedRoute roles={["admin", "owner"]}>
              <StallForm />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
