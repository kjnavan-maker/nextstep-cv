import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    position: "",
    packageName: "",
    notes: "",
    paymentStatus: "Pending",
    orderStatus: "Pending",
  });

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

  const openEditModal = (order) => {
    setEditingOrder(order);

    setEditForm({
      fullName: order.fullName || "",
      email: order.email || "",
      whatsapp: order.whatsapp || "",
      position: order.position || "",
      packageName: order.packageName || "",
      notes: order.notes || "",
      paymentStatus: order.paymentStatus || "Pending",
      orderStatus: order.orderStatus || "Pending",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveEditedOrder = async () => {
    try {
      const response = await API.put(`/orders/${editingOrder._id}`, editForm);

      if (response.data.success) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
      alert("Order update failed");
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

  const getFileUrl = (fileName) => {
    return `${API.defaults.baseURL.replace("/api", "")}/uploads/${fileName}`;
  };

  const getWhatsAppNumber = (number) => {
    if (!number) return "";
    return `94${number.replace(/^0/, "")}`;
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.whatsapp?.toLowerCase().includes(search.toLowerCase()) ||
      order.packageName?.toLowerCase().includes(search.toLowerCase()) ||
      order.position?.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Search orders by name, email, WhatsApp, position or package..."
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

              <p>
                <strong>Email:</strong> {order.email}
              </p>

              <p>
                <strong>WhatsApp:</strong> {order.whatsapp}
              </p>

              <p>
                <strong>Position:</strong> {order.position}
              </p>

              <p>
                <strong>Notes:</strong> {order.notes || "No notes"}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
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
                      href={getFileUrl(order.cvFile)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View CV
                    </a>

                    <a href={getFileUrl(order.cvFile)} download>
                      Download CV
                    </a>
                  </>
                )}

                <a
                  href={`https://wa.me/${getWhatsAppNumber(
                    order.whatsapp
                  )}?text=${encodeURIComponent(
                    `Hello ${order.fullName}, thank you for ordering the ${order.packageName} package from NextStep CV. Our CV expert will review your details and contact you shortly.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-action"
                >
                  WhatsApp
                </a>

                <button
                  onClick={() => openEditModal(order)}
                  className="edit-action"
                >
                  Edit
                </button>

                <button onClick={() => deleteOrder(order._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingOrder && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h2>Edit Order</h2>

            <input
              name="fullName"
              value={editForm.fullName}
              onChange={handleEditChange}
              placeholder="Full Name"
            />

            <input
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              placeholder="Email"
            />

            <input
              name="whatsapp"
              value={editForm.whatsapp}
              onChange={handleEditChange}
              placeholder="WhatsApp"
            />

            <input
              name="position"
              value={editForm.position}
              onChange={handleEditChange}
              placeholder="Position"
            />

            <select
              name="packageName"
              value={editForm.packageName}
              onChange={handleEditChange}
            >
              <option>Basic</option>
              <option>Professional</option>
              <option>Executive</option>
            </select>

            <select
              name="paymentStatus"
              value={editForm.paymentStatus}
              onChange={handleEditChange}
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>

            <select
              name="orderStatus"
              value={editForm.orderStatus}
              onChange={handleEditChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <textarea
              name="notes"
              value={editForm.notes}
              onChange={handleEditChange}
              placeholder="Notes"
            />

            <div className="edit-modal-actions">
              <button onClick={saveEditedOrder}>Save Changes</button>
              <button onClick={() => setEditingOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;