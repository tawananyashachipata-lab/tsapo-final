

import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AgentDashboard({ agentId, adminView = false }) {
  const [parcels, setParcels] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const token = localStorage.getItem("tsapo_token");

  // Load agent dashboard
  async function loadDashboard() {
    if (!agentId) {
      setError("No agent selected.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/api/agents/${agentId}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load dashboard.");
      }

      setAgent(data.agent);
      setParcels(data.parcels || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [agentId]);

  // Update parcel status
  async function updateStatus(parcelId, status) {
    try {
      setUpdating(parcelId);

      const response = await fetch(
        `${API}/api/parcels/${parcelId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update parcel.");
      }

      alert("Parcel status updated successfully.");
      await loadDashboard();

    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating("");
    }
  }

  // Print parcel receipt
  function printReceipt(parcel) {
    const receiptWindow = window.open("", "_blank");

    if (!receiptWindow) {
      alert("Please allow pop-ups to print receipts.");
      return;
    }

    const receipt = `
      <html>
        <head>
          <title>Tsapo Parcel Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            .receipt {
              max-width: 600px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 30px;
            }

            h1 {
              color: #16834a;
              text-align: center;
            }

            h2 {
              text-align: center;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
            }

            p {
              padding: 7px 0;
              border-bottom: 1px solid #eee;
            }

            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            <h1>TSAPO</h1>
            <h2>Parcel Receipt</h2>

            <p><strong>Tracking Code:</strong> ${parcel.trackingCode || "N/A"}</p>
            <p><strong>Sender:</strong> ${parcel.senderName || "N/A"}</p>
            <p><strong>Sender Phone:</strong> ${parcel.senderPhone || "N/A"}</p>
            <p><strong>Recipient:</strong> ${parcel.recipientName || "N/A"}</p>
            <p><strong>Recipient Phone:</strong> ${parcel.recipientPhone || "N/A"}</p>
            <p><strong>Pickup Address:</strong> ${parcel.pickupAddress || "N/A"}</p>
            <p><strong>Delivery Address:</strong> ${parcel.deliveryAddress || "N/A"}</p>
            <p><strong>Description:</strong> ${parcel.description || "N/A"}</p>
            <p><strong>Weight:</strong> ${parcel.weight ?? "N/A"}</p>
            <p><strong>Price:</strong> ${parcel.price ?? "N/A"}</p>
            <p><strong>Status:</strong> ${parcel.status || "N/A"}</p>
            <p><strong>Printed:</strong> ${new Date().toLocaleString()}</p>

            <div class="footer">
              Thank you for choosing Tsapo.<br />
              Delivering goods with care.
            </div>
          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(receipt);
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  }

  if (loading) {
    return <p>Loading agent dashboard...</p>;
  }

  if (error) {
    return (
      <div className="agent-dashboard">
        <p>{error}</p>
        <button onClick={loadDashboard}>Try Again</button>
      </div>
    );
  }

  // Parcel statistics using existing backend statuses
  const incoming = parcels.filter(parcel =>
    ["PENDING", "CONFIRMED", "PICKED_UP", "IN_TRANSIT"].includes(parcel.status)
  );

  const awaitingCollection = parcels.filter(
    parcel => parcel.status === "OUT_FOR_DELIVERY"
  );

  const collected = parcels.filter(
    parcel => parcel.status === "DELIVERED"
  );

  return (
    <div className="agent-dashboard">

      <header className="agent-header">
        <div>
          <h1>Tsapo Agent Dashboard</h1>
          <p>{agent?.name || "Agent"}</p>

          {adminView && (
            <span>Administrator viewing mode</span>
          )}
        </div>

        <button onClick={loadDashboard}>
          Refresh
        </button>
      </header>

      <section className="agent-stats">
        <div>
          <h2>{incoming.length}</h2>
          <p>Incoming parcels</p>
        </div>

        <div>
          <h2>{awaitingCollection.length}</h2>
          <p>Awaiting collection</p>
        </div>

        <div>
          <h2>{collected.length}</h2>
          <p>Completed deliveries</p>
        </div>

        <div>
          <h2>{parcels.length}</h2>
          <p>Total parcels</p>
        </div>
      </section>

      <h2>Assigned Parcels</h2>

      <div className="parcel-list">

        {parcels.length === 0 ? (
          <p>No parcels have been assigned to this agent yet.</p>
        ) : (
          parcels.map(parcel => (
            <article className="parcel-card" key={parcel.id}>

              <h3>{parcel.trackingCode || parcel.id}</h3>

              <p>
                <strong>Sender:</strong> {parcel.senderName || "N/A"}
              </p>

              <p>
                <strong>Sender Phone:</strong> {parcel.senderPhone || "N/A"}
              </p>

              <p>
                <strong>Recipient:</strong> {parcel.recipientName || "N/A"}
              </p>

              <p>
                <strong>Recipient Phone:</strong> {parcel.recipientPhone || "N/A"}
              </p>

              <p>
                <strong>Pickup Address:</strong> {parcel.pickupAddress || "N/A"}
              </p>

              <p>
                <strong>Delivery Address:</strong> {parcel.deliveryAddress || "N/A"}
              </p>

              <p>
                <strong>Description:</strong> {parcel.description || "N/A"}
              </p>

              <p>
                <strong>Weight:</strong> {parcel.weight ?? "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {parcel.status}
              </p>

              {!adminView && parcel.status === "IN_TRANSIT" && (
                <button
                  disabled={updating === parcel.id}
                  onClick={() =>
                    updateStatus(parcel.id, "OUT_FOR_DELIVERY")
                  }
                >
                  {updating === parcel.id
                    ? "Updating..."
                    : "Confirm Goods Received"}
                </button>
              )}

              {!adminView && parcel.status === "OUT_FOR_DELIVERY" && (
                <button
                  disabled={updating === parcel.id}
                  onClick={() =>
                    updateStatus(parcel.id, "DELIVERED")
                  }
                >
                  {updating === parcel.id
                    ? "Updating..."
                    : "Confirm Collection"}
                </button>
              )}

              <button onClick={() => printReceipt(parcel)}>
                Print Receipt
              </button>

            </article>
          ))
        )}

      </div>
    </div>
  );
}
