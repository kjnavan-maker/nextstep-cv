import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PaymentSuccess from "./payment/PaymentSuccess";
import PaymentCancel from "./payment/PaymentCancel";
import "./styles/global.css";
import TrackOrder from "./pages/TrackOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
          
        />
      </Routes>
      <Route path="/track-order" element={<TrackOrder />} />
    </BrowserRouter>
  );
}

export default App;