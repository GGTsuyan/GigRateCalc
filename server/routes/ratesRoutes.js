const express = require('express');
const pool = require('../../db/pool');
const ratesRepo = require('../../repos/ratesRepo');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rows = await ratesRepo.getAllRates(pool);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { project_type, base_rate_per_minute, rush_fee_percent } = req.body;

    if (!project_type || typeof project_type !== 'string' || project_type.trim() === '') {
      return res.status(400).json({ error: 'project_type is required' });
    }

    const base = Number(base_rate_per_minute);
    if (Number.isNaN(base) || base <= 0) {
      return res.status(400).json({ error: 'base_rate_per_minute must be a positive number' });
    }

    const rushValue = rush_fee_percent === undefined || rush_fee_percent === null || rush_fee_percent === ''
      ? 0
      : Number(rush_fee_percent);

    if (Number.isNaN(rushValue) || rushValue < 0) {
      return res.status(400).json({ error: 'rush_fee_percent must be a non-negative number' });
    }

    const cleanedName = project_type.trim();
    const existing = await ratesRepo.getAllRates(pool);
    const match = existing.find((rate) => rate.project_type.toLowerCase() === cleanedName.toLowerCase());

    if (match) {
      const updated = await ratesRepo.updateRate(pool, match.id, {
        project_type: cleanedName,
        base_rate_per_minute: base,
        rush_fee_percent: rushValue,
      });
      return res.status(200).json(updated);
    }

    const created = await ratesRepo.createRate(pool, {
      project_type: cleanedName,
      base_rate_per_minute: base,
      rush_fee_percent: rushValue,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const fields = {};
    if (req.body.project_type !== undefined) fields.project_type = req.body.project_type;
    if (req.body.base_rate_per_minute !== undefined) fields.base_rate_per_minute = Number(req.body.base_rate_per_minute);
    if (req.body.rush_fee_percent !== undefined) fields.rush_fee_percent = Number(req.body.rush_fee_percent);

    if (fields.project_type !== undefined && fields.project_type.trim() === '') {
      return res.status(400).json({ error: 'project_type cannot be empty' });
    }

    const updated = await ratesRepo.updateRate(pool, id, fields);
    if (!updated) return res.status(404).json({ error: 'rate not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const removed = await ratesRepo.deleteRate(pool, id);
    if (!removed) return res.status(404).json({ error: 'rate not found' });
    res.json(removed);
  } catch (err) {
    if (err && err.code === '23503') {
      return res.status(409).json({ error: 'This rate is used by saved quotes and cannot be deleted.' });
    }
    next(err);
  }
});

module.exports = router;
