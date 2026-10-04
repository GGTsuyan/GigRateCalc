import React, { useState } from 'react'
import { createQuote } from '../api'

const php = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export default function QuoteForm({ rates, refreshRates, refreshQuotes }) {
  const [form, setForm] = useState({
    project_rate_id: '',
    client_name: '',
    length_minutes: '',
    turnaround_days: '',
    is_rush: false,
  })
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  const selectedRate = rates.find((rate) => String(rate.id) === String(form.project_rate_id))
  const previewQuote = selectedRate && form.length_minutes
    ? Number(selectedRate.base_rate_per_minute) * Number(form.length_minutes) * (form.is_rush ? 1 + Number(selectedRate.rush_fee_percent || 0) / 100 : 1)
    : 0

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    try {
      const created = await createQuote({
        project_rate_id: Number(form.project_rate_id),
        client_name: form.client_name,
        length_minutes: Number(form.length_minutes),
        turnaround_days: Number(form.turnaround_days),
        is_rush: form.is_rush,
      })
      setResult(created)
      setMessage('Quote saved successfully.')
      setForm((current) => ({ ...current, client_name: '', length_minutes: '', turnaround_days: '', is_rush: false }))
      await refreshQuotes()
      await refreshRates()
    } catch (error) {
      setMessage(error.message || 'Could not create quote.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="card">
        <div className="rate-form">
          <label>
            Client name
            <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
          </label>

          <label>
            Project type
            <select value={form.project_rate_id} onChange={(e) => setForm({ ...form, project_rate_id: e.target.value })}>
              <option value="">-- Select a project type --</option>
              {rates.map((r) => <option key={r.id} value={r.id}>{r.project_type}</option>)}
            </select>
          </label>

          <label>
            Length (minutes)
            <input value={form.length_minutes} onChange={(e) => setForm({ ...form, length_minutes: e.target.value })} />
          </label>

          <label>
            Turnaround days
            <input value={form.turnaround_days} onChange={(e) => setForm({ ...form, turnaround_days: e.target.value })} />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.is_rush}
              onChange={(e) => setForm({ ...form, is_rush: e.target.checked })}
            />
            Rush fee applies
          </label>

          {selectedRate && form.length_minutes && (
            <div className="estimate-box">
              <strong>Estimated quote</strong>
              <div className="rate-value">{php.format(previewQuote)}</div>
              <small>
                {php.format(Number(selectedRate.base_rate_per_minute))} × {form.length_minutes} min
                {form.is_rush ? ` × ${(1 + Number(selectedRate.rush_fee_percent || 0) / 100).toFixed(2)} rush` : ''}
              </small>
            </div>
          )}

          <button type="submit" className="primary-button" disabled={rates.length === 0}>
            Calculate & save quote
          </button>
          {rates.length === 0 && <p className="feedback-text">Save a project rate in Settings before creating a quote.</p>}
          {message && <p className="feedback-text">{message}</p>}
        </div>
      </form>

      {result && (
        <div className="card">
          <h3>Saved Quote</h3>
          <div className="rate-value">{php.format(Number(result.final_quote))}</div>
          <div><strong>Client:</strong> {result.client_name}</div>
          <div><strong>Rush:</strong> {result.is_rush ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}
