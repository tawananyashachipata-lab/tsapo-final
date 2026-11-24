import "./BecomeAgent.css";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function BecomeAgent() {
  const [form, setForm] = useState({
    location: "",
    address: "",
    reason: ""
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("tsapo_token");

  useEffect(() => {
    async function checkApplication() {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(
          `${API}/api/agents/my-application`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setApplication(data.application);
        } else {
          setError(data.error || "Could not check your application.");
        }
      } catch {
        setError("Unable to connect to Tsapo. Please try again.");
      } finally {
        setChecking(false);
      }
    }

    checkApplication();
  }, [token]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      setError("Please sign in to your Tsapo account before applying.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/api/agents/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Application submission failed.");
      }

      setApplication(data.application);
      setSuccess(
        "Your application has been submitted successfully. Please wait for admin approval."
      );

      setForm({
        location: "",
        address: "",
        reason: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <p>Checking your application...</p>;
  }

  if (application) {
    return (
      <main className="become-agent-page">
        <div className="agent-application-container">
          <h1>Your Agent Application</h1>

          <p>
            Thank you for your interest in becoming a Tsapo agent.
          </p>

          <div className="application-status">
            <strong>Application status:</strong>{" "}
            {application.status}
          </div>

          {application.status === "PENDING" && (
            <p>
              Your application is being reviewed by the Tsapo
              administration team.
            </p>
          )}

          {application.status === "APPROVED" && (
            <p>
              Congratulations! Your application has been approved.
              You can now access your agent account after signing in
              again if necessary.
            </p>
          )}

          {application.status === "REJECTED" && (
            <p>
              Unfortunately, your application was not approved.
              {application.adminNote
                ? ` Admin note: ${application.adminNote}`
                : ""}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="become-agent-page">
      <div className="agent-application-container">
        <h1>Become a Tsapo Agent</h1>

        <p>
          Join the Tsapo delivery network and help connect people
          through reliable parcel delivery.
        </p>

        {success && (
          <div className="success-message">{success}</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!token && (
          <p>Please sign in to your Tsapo account before applying.</p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="location">Town / Location</label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Harare"
            required
          />

          <label htmlFor="address">Physical Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your physical address"
            required
          />

          <label htmlFor="reason">
            Why would you like to become a Tsapo agent?
          </label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Tell us why you would like to join Tsapo..."
            required
          />

          <button type="submit" disabled={loading || !token}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </main>
  );
}
