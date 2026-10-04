const createApp = require('./app');
const pool = require('../db/pool');
const { createSchema } = require('../db/schema');

const PORT = process.env.PORT || 4000;

async function start() {
  // ensure schema exists
  await createSchema(pool);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
