import React from 'react'
import { deleteQuote } from '../api'

const php = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})

export default function QuotesHistory({ quotes, refreshQuotes }) {
  async function handleDelete(id) {
    if (!window.confirm('Delete this saved quote?')) return

    try {
      await deleteQuote(id)
      await refreshQuotes()
    } catch (error) {
      window.alert(error.message || 'Could not delete quote.')
    }
  }

  return (
    <div className="rates-grid">
      {quotes.length === 0 ? (
        <div className="card empty-state">No saved quotes yet. Your recent estimates will appear here.</div>
      ) : (
        quotes.map((q) => (
          <div key={q.id} className="card rate-item">
            <div className="rate-topline">
              <strong>{q.project_type}</strong>
              <span className="tag muted-tag">{q.is_rush ? 'Rush' : 'Standard'}</span>
            </div>
            <div className="rate-value">{php.format(Number(q.final_quote))}</div>
            <div><strong>Client:</strong> {q.client_name}</div>
            <div><strong>Length:</strong> {q.length_minutes} min</div>
            <div><small>{new Date(q.created_at).toLocaleString()}</small></div>
            <div className="card-actions">
              <button type="button" className="danger-button" onClick={() => handleDelete(q.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
