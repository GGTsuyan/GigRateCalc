const express = require('express');
const pool = require('../../db/pool');
const quotesRepo = require('../../repos/quotesRepo');
const ratesRepo = require('../../repos/ratesRepo');

const router = express.Router();

const RUSH_THRESHOLD_DAYS = Number(process.env.RUSH_THRESHOLD_DAYS) || 3;

router.get('/', async (req, res, next) => {
  try {
    const rows = await quotesRepo.getAllQuotes(pool);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const row = await quotesRepo.getQuoteById(pool, id);
    if (!row) return res.status(404).json({ error: 'quote not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { project_rate_id, client_name, length_minutes, turnaround_days, is_rush } = req.body;

    const pid = Number(project_rate_id);
    const length = Number(length_minutes);
    const turnaround = Number(turnaround_days);
    const rushEnabled = Boolean(is_rush) || turnaround <= RUSH_THRESHOLD_DAYS;

    if (Number.isNaN(pid) || pid <= 0) return res.status(400).json({ error: 'project_rate_id is required' });
    if (!client_name || typeof client_name !== 'string') return res.status(400).json({ error: 'client_name is required' });
    if (Number.isNaN(length) || length <= 0) return res.status(400).json({ error: 'length_minutes must be a positive number' });
    if (!Number.isInteger(turnaround) || turnaround < 0) return res.status(400).json({ error: 'turnaround_days must be a non-negative integer' });

    const rate = await ratesRepo.getRateById(pool, pid);
    if (!rate) return res.status(400).json({ error: 'project rate not found' });

    const base = Number(rate.base_rate_per_minute);
    const rushPct = Number(rate.rush_fee_percent) || 0;
    const multiplier = rushEnabled ? (1 + rushPct / 100) : 1;
    const final_quote = base * length * multiplier;

    const created = await quotesRepo.createQuote(pool, {
      project_rate_id: pid,
      client_name: client_name.trim(),
      length_minutes: length,
      turnaround_days: turnaround,
      is_rush: rushEnabled,
      final_quote,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const removed = await quotesRepo.deleteQuote(pool, id);
    if (!removed) return res.status(404).json({ error: 'quote not found' });
    res.json(removed);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
