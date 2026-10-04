// repos/quotesRepo.js
// Data-access functions for the quotes table. All queries are parameterized.

async function getAllQuotes(pool) {
  const res = await pool.query(
    `SELECT q.id, q.client_name, q.length_minutes, q.turnaround_days, q.is_rush, q.final_quote, q.created_at,
            pr.id AS project_rate_id, pr.project_type, pr.base_rate_per_minute, pr.rush_fee_percent
     FROM quotes q
     JOIN project_rates pr ON q.project_rate_id = pr.id
     ORDER BY q.created_at DESC`
  );
  return res.rows;
}

async function getQuoteById(pool, id) {
  const res = await pool.query(
    `SELECT q.id, q.client_name, q.length_minutes, q.turnaround_days, q.is_rush, q.final_quote, q.created_at,
            pr.id AS project_rate_id, pr.project_type, pr.base_rate_per_minute, pr.rush_fee_percent
     FROM quotes q
     JOIN project_rates pr ON q.project_rate_id = pr.id
     WHERE q.id = $1`,
    [id]
  );
  return res.rows[0] || null;
}

async function createQuote(pool, { project_rate_id, client_name, length_minutes, turnaround_days, is_rush = false, final_quote }) {
  const res = await pool.query(
    `INSERT INTO quotes (project_rate_id, client_name, length_minutes, turnaround_days, is_rush, final_quote)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [project_rate_id, client_name, length_minutes, turnaround_days, is_rush, final_quote]
  );
  return res.rows[0];
}

async function deleteQuote(pool, id) {
  const res = await pool.query('DELETE FROM quotes WHERE id = $1 RETURNING *', [id]);
  return res.rows[0] || null;
}

module.exports = {
  getAllQuotes,
  getQuoteById,
  createQuote,
  deleteQuote,
};
