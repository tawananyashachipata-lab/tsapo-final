
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function AdminDashboard() {
  const [data, setData] = useState({
    statistics: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    goods: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedGoods, setSelectedGoods] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load dashboard");
      }

      setData(result);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function updateGoods(id, action, reason = "") {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/goods/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Action failed");
      }

      setSelectedGoods(null);
      setRejectReason("");

      await loadDashboard();

      alert(result.message);
    } catch (err) {
      alert(err.message);
    }
  }

  const filteredGoods = data.goods.filter((item) => {
    const matchesStatus =
      filter === "ALL" || item.status === filter;

    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const cards = [
    { label: "Total Goods", value: data.statistics.total },
    { label: "Pending", value: data.statistics.pending },
    { label: "Approved", value: data.statistics.approved },
    { label: "Rejected", value: data.statistics.rejected }
  ];

  if (loading) {
    return <div className="admin-loading">Loading Tsapo Dashboard...</div>;
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">TSAPO MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage and review submitted goods.</p>
        </div>

        <button onClick={loadDashboard} className="refresh-btn">
          Refresh
        </button>
      </header>

      {error && <div className="admin-error">{error}</div>}

      <section className="stats-grid">
        {cards.map((card) => (
          <article className="stat-card" key={card.label}>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
          </article>
        ))}
      </section>

      <section className="goods-section">
        <div className="goods-heading">
          <div>
            <h2>Goods Management</h2>
            <p>Review and manage submitted goods.</p>
          </div>
        </div>

        <div className="goods-filters">
          <input
            type="search"
            placeholder="Search goods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Goods</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="goods-table-wrapper">
          <table className="goods-table">
            <thead>
              <tr>
                <th>Goods</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGoods.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`status ${item.status?.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedGoods(item)}
                      >
                        View
                      </button>

                      {item.status === "PENDING" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => {
                              if (window.confirm("Approve these goods?")) {
                                updateGoods(item.id, "approve");
                              }
                            }}
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            onClick={() => setSelectedGoods(item)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGoods.length === 0 && (
                <tr>
                  <td colSpan="5">No goods found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedGoods && (
        <div className="modal-overlay">
          <div className="goods-modal">
            <h2>Goods Details</h2>

            <p><strong>Name:</strong> {selectedGoods.name}</p>
            <p><strong>Description:</strong> {selectedGoods.description}</p>
            <p><strong>Status:</strong> {selectedGoods.status}</p>
            <p><strong>Sender:</strong> {selectedGoods.senderName || "—"}</p>
            <p><strong>Recipient:</strong> {selectedGoods.recipientName || "—"}</p>

            {selectedGoods.status === "PENDING" && (
              <>
                <button
                  className="approve-btn"
                  onClick={() => {
                    if (window.confirm("Approve these goods?")) {
                      updateGoods(selectedGoods.id, "approve");
                    }
                  }}
                >
                  Approve Goods
                </button>

                <textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />

                <button
                  className="reject-btn"
                  disabled={!rejectReason.trim()}
                  onClick={() => {
                    if (window.confirm("Reject these goods?")) {
                      updateGoods(
                        selectedGoods.id,
                        "reject",
                        rejectReason
                      );
                    }
                  }}
                >
                  Reject Goods
                </button>
              </>
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedGoods(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
