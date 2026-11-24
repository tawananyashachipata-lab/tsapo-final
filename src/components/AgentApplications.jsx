
import "./AgentApplications.css";
import React, { useEffect, useState } from "react";


export default function AgentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("tsapo_token");

      const response = await fetch("/api/admin/agent-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load applications");
      }

      setApplications(
        Array.isArray(data) ? data : data.applications || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateApplication = async (id, status) => {
    const action = status === "APPROVED" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this application?`)) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");

      const token = localStorage.getItem("tsapo_token");

      const response = await fetch(
        `/api/admin/agent-applications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} application`);
      }

      await fetchApplications();
      alert(`Application ${action}d successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p>Loading agent applications...</p>;
  }

  return (
    <div className="agent-applications">
      <div className="applications-header">
        <div>
          <h2>Agent Applications</h2>
          <p>Review and manage people applying to become Tsapo agents.</p>
        </div>

        <button onClick={fetchApplications} className="refresh-btn">
          Refresh
        </button>
      </div>

      {error && <p className="application-error">{error}</p>}

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h3>No applications yet</h3>
          <p>New agent applications will appear here.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            const applicant = application.user || {};

            const name =
              applicant.name ||
              application.name ||
              application.fullName ||
              "Unknown applicant";

            const status = application.status || "PENDING";

            return (
              <div className="application-card" key={application.id}>
                <div className="application-top">
                  <div>
                    <h3>{name}</h3>
                    <p>
                      {applicant.email || application.email || "No email provided"}
                    </p>
                  </div>

                  <span className={`application-status ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>

                <div className="application-details">
                  <p>
                    <strong>Location:</strong>{" "}
                    {application.location || "Not provided"}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {application.address || "Not provided"}
                  </p>

                  <p>
                    <strong>Reason:</strong>{" "}
                    {application.reason || "Not provided"}
                  </p>
                </div>

                {status === "PENDING" && (
                  <div className="application-actions">
                    <button
                      className="approve-btn"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        updateApplication(application.id, "APPROVED")
                      }
                    >
                      {updatingId === application.id
                        ? "Please wait..."
                        : "Approve"}
                    </button>

                    <button
                      className="reject-btn"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        updateApplication(application.id, "REJECTED")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}