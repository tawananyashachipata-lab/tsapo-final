
import React, { useState } from 'react';

export default function AgentApplication() {
  const [form, setForm] = useState({
    location: '',
    address: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/agents/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tsapo_token')}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Application failed.');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-application">
      <h2>Become a Tsapo Agent</h2>
      <p>Apply to operate a Tsapo parcel collection point.</p>

      <form onSubmit={submit}>
        <label>Your location</label>
        <input
          placeholder="e.g. Gokwe"
          value={form.location}
          onChange={e => setForm({
            ...form,
            location: e.target.value
          })}
          required
        />

        <label>Physical address</label>
        <textarea
          placeholder="Enter your proposed collection point address"
          value={form.address}
          onChange={e => setForm({
            ...form,
            address: e.target.value
          })}
          required
        />

        <label>Why do you want to become a Tsapo agent?</label>
        <textarea
          placeholder="Tell us about your interest and experience"
          value={form.reason}
          onChange={e => setForm({
            ...form,
            reason: e.target.value
          })}
          required
        />

        <button disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
