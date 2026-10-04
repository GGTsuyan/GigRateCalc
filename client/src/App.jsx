import React, { useEffect, useState } from 'react'
import { getQuotes, getRates } from './api'
import Settings from './components/Settings'
import QuoteForm from './components/QuoteForm'
import QuotesHistory from './components/QuotesHistory'

export default function App() {
  const [rates, setRates] = useState([])
  const [quotes, setQuotes] = useState([])

  const refreshRates = async () => {
    const rows = await getRates()
    setRates(rows)
  }

  const refreshQuotes = async () => {
    const rows = await getQuotes()
    setQuotes(rows)
  }

  useEffect(() => {
    refreshRates().catch(() => {})
    refreshQuotes().catch(() => {})
  }, [])

  return (
    <div className="app-shell">
      <div className="page-glow" />
      <header className="topbar">
        <div>
          <p className="eyebrow">Freelance pricing studio</p>
          <h1>Gig Rate Calc</h1>
        </div>
        <div className="currency-chip">₱ PHP Pricing</div>
      </header>

      <main className="dashboard-grid">
        <section className="panel panel-wide">
          <div className="section-label">Settings</div>
          <Settings rates={rates} refreshRates={refreshRates} />
        </section>

        <section className="panel">
          <div className="section-label">Create Quote</div>
          <QuoteForm rates={rates} refreshRates={refreshRates} refreshQuotes={refreshQuotes} />
        </section>

        <section className="panel panel-wide">
          <div className="section-label">Quote History</div>
          <QuotesHistory quotes={quotes} refreshQuotes={refreshQuotes} />
        </section>
      </main>
    </div>
  )
}
