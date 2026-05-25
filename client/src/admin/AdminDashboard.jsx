import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    navigate("/admin/login");
    return;
  }

  fetchOrders();
}, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load orders");
    }
  };

  const updateStatus = async (id, field, value) => {
    try {
      const order = orders.find((item) => item._id === id);

      const updatedData = {
        orderStatus: field === "orderStatus" ? value : order.orderStatus,
        paymentStatus: field === "paymentStatus" ? value : order.paymentStatus,
      };

      const response = await API.put(`/orders/${id}/status`, updatedData);

      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      alert("Status update failed");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const response = await API.delete(`/orders/${id}`);

      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminName");
  navigate("/admin/login");
};

  const filteredOrders = orders.filter(
    (order) =>
      order.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.whatsapp?.toLowerCase().includes(search.toLowerCase()) ||
      order.packageName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-topbar">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage CV orders, payments and delivery progress.</p>
        </div>

        <div className="admin-top-actions">
          <button onClick={fetchOrders} className="refresh-btn">
            Refresh
          </button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-stats">
        <div>
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div>
          <h2>{orders.filter((o) => o.paymentStatus === "Paid").length}</h2>
          <p>Paid Orders</p>
        </div>

        <div>
          <h2>{orders.filter((o) => o.orderStatus === "Completed").length}</h2>
          <p>Completed Orders</p>
        </div>
      </div>

      <div className="admin-search">
        <input
          type="text"
          placeholder="Search orders by name, email, WhatsApp or package..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders found</h2>
          <p>New customer orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-head">
                <h2>{order.fullName}</h2>
                <span>{order.packageName}</span>
              </div>

              <p><strong>Position:</strong> {order.position}</p>
<p><strong>Notes:</strong> {order.notes || "No notes"}</p>

<p>
  <strong>Order Date:</strong>{" "}
  {new Date(order.createdAt).toLocaleString()}
</p>

              <div className="admin-select-group">
                <label>Payment Status</label>
                <select
                  value={order.paymentStatus || "Pending"}
                  onChange={(e) =>
                    updateStatus(order._id, "paymentStatus", e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Failed</option>
                </select>
              </div>

              <div className="admin-select-group">
                <label>Order Status</label>
                <select
                  value={order.orderStatus || "Pending"}
                  onChange={(e) =>
                    updateStatus(order._id, "orderStatus", e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="order-actions">
                {order.cvFile && (
  <>
    <a
      href={`http://localhost:5000/uploads/${order.cvFile}`}
      target="_blank"
      rel="noreferrer"
    >
      View CV
    </a>

    <a
      href={`http://localhost:5000/uploads/${order.cvFile}`}
      download
    >
      Download CV
    </a>
  </>
)}

                <a
  href={`https://wa.me/94${order.whatsapp.replace(/^0/, "")}?text=${encodeURIComponent(
    `Hello ${order.fullName}, thank you for ordering the ${order.packageName} package from NextStep CV. Our CV expert will review your details and contact you shortly.`
  )}`}
  target="_blank"
  rel="noreferrer"
  className="whatsapp-action"
>
  WhatsApp
</a>

                <button onClick={() => deleteOrder(order._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;