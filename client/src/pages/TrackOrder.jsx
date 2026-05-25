import { useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function TrackOrder() {
  const [form, setForm] = useState({
    email: "",
    whatsapp: "",
  });

  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const trackOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);

    try {
      const response = await API.post("/orders/track", form);

      if (response.data.success) {
        setOrders(response.data.orders);
        setSearched(true);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="track-page">
        <div className="track-box">
          <span>Track Your Order</span>
          <h1>Check Your CV Order Status</h1>
          <p>Enter your email and WhatsApp number used during order submission.</p>

          <form onSubmit={trackOrder} className="track-form">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number"
              value={form.whatsapp}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>

          {searched && orders.length === 0 && (
            <div className="track-empty">
              <h3>No order found</h3>
              <p>Please check your email and WhatsApp number.</p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="track-results">
              {orders.map((order) => (
                <div className="track-card" key={order._id}>
                  <h3>{order.fullName}</h3>

                  <p>
                    <strong>Package:</strong> {order.packageName}
                  </p>

                  <p>
                    <strong>Job Position:</strong> {order.position}
                  </p>

                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className={`status ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </p>

                  <p>
                    <strong>Order Status:</strong>{" "}
                    <span className={`status ${order.orderStatus?.replace(" ", "-")}`}>
                      {order.orderStatus}
                    </span>
                  </p>

                  <p>
                    <strong>Order Date:</strong>{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default TrackOrder;