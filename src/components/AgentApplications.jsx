

import React, { useEffect, useState } from "react";
import "./AgentApplications.css";

export default function AgentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================
  // FETCH AGENT APPLICATIONS
  // =====================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("tsapo_token");

      if (!token) {
        throw new Error("Please log in as an administrator.");
      }

      const response = await fetch(
        "/api/admin/agent-applications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load agent applications."
        );
      }

      setApplications(
        Array.isArray(data)
          ? data
          : data.applications || []
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load applications when component opens
  useEffect(() => {
    fetchApplications();
  }, []);

  // =====================================
  // APPROVE OR REJECT APPLICATION
  // =====================================

  const updateApplication = async (id, decision) => {
    const action =
      decision === "APPROVED" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this application?`
    );

    if (!confirmed) return;

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
          body: JSON.stringify({
            decision: decision,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to ${action} application.`
        );
      }

      alert(
        data.message ||
        `Application ${action}d successfully!`
      );

      await fetchApplications();

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {
    return (
      <div className="agent-applications">
        <p>Loading agent applications...</p>
      </div>
    );
  }

  // =====================================
  // AGENT APPLICATIONS DISPLAY
  // =====================================

  return (
    <div className="agent-applications">

      <div className="applications-header">
        <div>
          <h2>Agent Applications</h2>
          <p>
            Review and manage people applying to become Tsapo agents.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="refresh-btn"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* ERROR MESSAGE */}

      {error && (
        <p className="application-error">
          {error}
        </p>
      )}

      {/* EMPTY APPLICATIONS */}

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h3>No applications yet</h3>
          <p>
            New agent applications will appear here.
          </p>
        </div>
      ) : (

        /* APPLICATIONS LIST */

        <div className="applications-list">

          {applications.map((application) => {
            const applicant = application.user || {};

            const name =
              applicant.name ||
              application.name ||
              application.fullName ||
              "Unknown applicant";

            const email =
              applicant.email ||
              application.email ||
              "No email provided";

            const status =
              application.status || "PENDING";

            return (
              <div
                className="application-card"
                key={application.id}
              >

                {/* APPLICANT DETAILS */}

                <div className="application-top">
                  <div>
                    <h3>{name}</h3>
                    <p>{email}</p>
                  </div>

                  <span
                    className={`application-status ${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>

                {/* APPLICATION INFORMATION */}

                <div className="application-details">

                  <p>
                    <strong>Phone:</strong>{" "}
                    {applicant.phone ||
                      application.phone ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {application.location ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {application.address ||
                      "Not provided"}
                  </p>

                  <p>
                    <strong>Reason:</strong>{" "}
                    {application.reason ||
                      "Not provided"}
                  </p>

                </div>

                {/* APPROVE AND REJECT BUTTONS */}

                {status === "PENDING" && (
                  <div className="application-actions">

                    <button
                      className="approve-btn"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        updateApplication(
                          application.id,
                          "APPROVED"
                        )
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
                        updateApplication(
                          application.id,
                          "REJECTED"
                        )
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



