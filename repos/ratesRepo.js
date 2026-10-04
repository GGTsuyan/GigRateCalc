// repos/ratesRepo.js
// Data-access functions for the project_rates table.

async function getAllRates(pool) {
  const res = await pool.query(
    `SELECT id, project_type, base_rate_per_minute, rush_fee_percent
     FROM project_rates
     ORDER BY project_type`
  );
  return res.rows;
}

async function getRateById(pool, id) {
  const res = await pool.query(
    'SELECT * FROM project_rates WHERE id = $1',
    [id]
  );
  return res.rows[0] || null;
}

async function createRate(pool, { project_type, base_rate_per_minute, rush_fee_percent = 0 }) {
  const res = await pool.query(
    `INSERT INTO project_rates (project_type, base_rate_per_minute, rush_fee_percent)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [project_type, base_rate_per_minute, rush_fee_percent]
  );
  return res.rows[0];
}

async function updateRate(pool, id, fields) {
  const parts = [];
  const values = [];
  let idx = 1;

  if (fields.project_type !== undefined) {
    parts.push(`project_type = $${idx++}`);
    values.push(fields.project_type);
  }
  if (fields.base_rate_per_minute !== undefined) {
    parts.push(`base_rate_per_minute = $${idx++}`);
    values.push(fields.base_rate_per_minute);
  }
  if (fields.rush_fee_percent !== undefined) {
    parts.push(`rush_fee_percent = $${idx++}`);
    values.push(fields.rush_fee_percent);
  }

  if (parts.length === 0) {
    return getRateById(pool, id);
  }

  values.push(id);
  const q = `UPDATE project_rates SET ${parts.join(', ')} WHERE id = $${idx} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

async function deleteRate(pool, id) {
  const res = await pool.query('DELETE FROM project_rates WHERE id = $1 RETURNING *', [id]);
  return res.rows[0] || null;
}

module.exports = {
  getAllRates,
  getRateById,
  createRate,
  updateRate,
  deleteRate,
};
