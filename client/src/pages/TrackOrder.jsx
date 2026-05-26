import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function TrackOrder() {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSearched(false);

      const response = await API.post("/orders/track", {
        email,
        whatsapp,
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setSearched(true);
      }
    } catch (error) {
      console.log(error);
      alert("Order tracking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="track-page">
        <div className="track-box">
          <div className="nav-links">
  <a href="#home">Home</a>
  <a href="#services">Services</a>
  <a href="#packages">Packages</a>
  <a href="#portfolio">Portfolio</a>
  <a href="#contact">Contact</a>

  <a href="/track-order">Track Order</a>
</div>
          <h1>Check Your CV Order Status</h1>
          <p>
            Enter the email and WhatsApp number you used when submitting your
            CV order.
          </p>

          <form className="track-form" onSubmit={handleTrack}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>

          {searched && orders.length === 0 && (
            <div className="track-empty">
              <h3>No Order Found</h3>
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
                      {order.paymentStatus || "Pending"}
                    </span>
                  </p>

                  <p>
                    <strong>Order Status:</strong>{" "}
                    <span
                      className={`status ${order.orderStatus?.replace(
                        " ",
                        "-"
                      )}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </p>

                  <div className="progress-container">
  <div
    className={`progress-step ${
      order.orderStatus === "Pending" ? "active" : "done"
    }`}
  >
    Pending
  </div>

  <div
    className={`progress-step ${
      order.orderStatus === "In Progress" ? "active" : ""
    }`}
  >
    In Progress
  </div>

  <div
    className={`progress-step ${
      order.orderStatus === "Designing" ? "active" : ""
    }`}
  >
    Designing
  </div>

  <div
    className={`progress-step ${
      order.orderStatus === "Delivered" ? "active" : ""
    }`}
  >
    Delivered
  </div>

  <div
    className={`progress-step ${
      order.orderStatus === "Completed" ? "active" : ""
    }`}
  >
    Completed
  </div>
</div>

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