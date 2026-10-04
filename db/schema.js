// db/schema.js
// Creates the required tables for the Gig Rate Calc app.
async function createSchema(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_rates (
        id SERIAL PRIMARY KEY,
        project_type TEXT NOT NULL UNIQUE,
        base_rate_per_minute NUMERIC NOT NULL,
        rush_fee_percent NUMERIC NOT NULL DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        project_rate_id INTEGER NOT NULL REFERENCES project_rates(id) ON DELETE RESTRICT,
        client_name TEXT NOT NULL,
        length_minutes NUMERIC NOT NULL,
        turnaround_days INTEGER NOT NULL,
        is_rush BOOLEAN NOT NULL DEFAULT false,
        final_quote NUMERIC NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createSchema };
