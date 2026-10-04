const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export async function getRates() {
  return fetchJSON(`${API_BASE}/api/rates`);
}

export async function createRate(data) {
  return fetchJSON(`${API_BASE}/api/rates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

export async function updateRate(id, data) {
  return fetchJSON(`${API_BASE}/api/rates/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

export async function deleteRate(id) {
  return fetchJSON(`${API_BASE}/api/rates/${id}`, { method: 'DELETE' });
}

export async function getQuotes() {
  return fetchJSON(`${API_BASE}/api/quotes`);
}

export async function createQuote(data) {
  return fetchJSON(`${API_BASE}/api/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}

export async function deleteQuote(id) {
  return fetchJSON(`${API_BASE}/api/quotes/${id}`, { method: 'DELETE' });
}

export async function getQuoteById(id) {
  return fetchJSON(`${API_BASE}/api/quotes/${id}`);
}
