import React, { useState } from 'react'
import { createRate, deleteRate, updateRate } from '../api'

const RATE_PRESETS = {
  'Music Video': { base_rate_per_minute: 850, rush_fee_percent: 25 },
  'Vlog': { base_rate_per_minute: 420, rush_fee_percent: 20 },
  'Podcast': { base_rate_per_minute: 350, rush_fee_percent: 15 },
  'Advertisement': { base_rate_per_minute: 1200, rush_fee_percent: 30 },
  'Social Media Reel': { base_rate_per_minute: 550, rush_fee_percent: 20 },
  'Event Coverage': { base_rate_per_minute: 700, rush_fee_percent: 25 },
  'Documentary': { base_rate_per_minute: 950, rush_fee_percent: 30 },
  'Commercial': { base_rate_per_minute: 1100, rush_fee_percent: 25 },
}

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export default function Settings({ rates, refreshRates }) {
  const [form, setForm] = useState({
    project_type: '',
    base_rate_per_minute: '',
    rush_fee_percent: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [feedback, setFeedback] = useState('')

  function fillPreset(value) {
    const preset = RATE_PRESETS[value]
    setForm({
      project_type: value,
      base_rate_per_minute: preset ? String(preset.base_rate_per_minute) : '',
      rush_fee_percent: preset ? String(preset.rush_fee_percent) : '',
    })
  }

  function resetForm() {
    setForm({ project_type: '', base_rate_per_minute: '', rush_fee_percent: '' })
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      project_type: form.project_type.trim(),
      base_rate_per_minute: Number(form.base_rate_per_minute),
      rush_fee_percent: Number(form.rush_fee_percent || 0),
    }

    if (!payload.project_type) {
      setFeedback('Enter a project type first.')
      return
    }

    if (!Number.isFinite(payload.base_rate_per_minute) || payload.base_rate_per_minute <= 0) {
      setFeedback('Base rate per minute must be a positive number.')
      return
    }

    try {
      if (editingId) {
        await updateRate(editingId, payload)
        setFeedback('Rate updated successfully.')
      } else {
        await createRate(payload)
        setFeedback('Rate saved successfully.')
      }
      resetForm()
      await refreshRates()
    } catch (error) {
      setFeedback(error.message || 'Could not save rate.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project rate?')) return

    try {
      await deleteRate(id)
      if (editingId === id) resetForm()
      await refreshRates()
      setFeedback('Rate deleted.')
    } catch (error) {
      setFeedback(error.message || 'Could not delete rate.')
    }
  }

  function startEdit(rate) {
    setEditingId(rate.id)
    setForm({
      project_type: rate.project_type,
      base_rate_per_minute: String(rate.base_rate_per_minute),
      rush_fee_percent: String(rate.rush_fee_percent),
    })
    setFeedback('Editing saved rate.')
  }

  return (
    <div className="settings-panel">
      <div className="card compact-card">
        <div className="card-header">
          <h3>Project pricing</h3>
          <span className="tag">PHP</span>
        </div>

        <form onSubmit={handleSubmit} className="rate-form">
          <label>
            Project type
            <input
              type="text"
              placeholder="e.g. Wedding Highlight"
              value={form.project_type}
              onChange={(e) => setForm({ ...form, project_type: e.target.value })}
            />
          </label>

          <div className="preset-row">
            {Object.keys(RATE_PRESETS).map((type) => (
              <button key={type} type="button" className="ghost-button" onClick={() => fillPreset(type)}>
                {type}
              </button>
            ))}
          </div>

          <label>
            Base rate / minute
            <div className="input-with-prefix">
              <span>₱</span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.base_rate_per_minute}
                onChange={(e) => setForm({ ...form, base_rate_per_minute: e.target.value })}
              />
            </div>
          </label>

          <label>
            Rush fee %
            <div className="input-with-prefix">
              <span>%</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.rush_fee_percent}
                onChange={(e) => setForm({ ...form, rush_fee_percent: e.target.value })}
              />
            </div>
          </label>

          <div className="action-row">
            <button type="submit" className="primary-button">
              {editingId ? 'Update rate' : 'Save rate'}
            </button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {feedback && <p className="feedback-text">{feedback}</p>}
        </form>
      </div>

      <div className="rates-grid">
        {rates.length === 0 ? (
          <div className="card empty-state">
            No project rates yet. Save your first standard pricing profile to start quoting.
          </div>
        ) : (
          rates.map((rate) => (
            <div key={rate.id} className="rate-item card">
              <div className="rate-topline">
                <strong>{rate.project_type}</strong>
                <span className="tag muted-tag">Rush {rate.rush_fee_percent}%</span>
              </div>
              <div className="rate-value">{currency.format(Number(rate.base_rate_per_minute))}</div>
              <small>per minute</small>
              <div className="card-actions">
                <button type="button" className="ghost-button" onClick={() => startEdit(rate)}>Edit</button>
                <button type="button" className="danger-button" onClick={() => handleDelete(rate.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
