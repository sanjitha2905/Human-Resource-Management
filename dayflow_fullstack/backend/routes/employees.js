const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();
router.use(authenticate, requireRole('HR'));

router.get('/', (req,res) => {
  const rows = db.prepare(`SELECT id,staff_id AS staffId,name,email,department,designation,salary,dob FROM users WHERE role='Employee' ORDER BY id DESC`).all();
  res.json({employees:rows});
});

router.post('/', (req,res) => {
  const {staffId,name,dob,email,department,designation,salary} = req.body || {};
  if (!staffId || !name || !dob) return res.status(400).json({message:'staffId, name and dob are required'});
  try {
    const result = db.prepare(`INSERT INTO users(staff_id,name,role,dob,email,department,designation,salary,password_hash)
      VALUES(?,?,?,?,?,?,?,?,?)`).run(staffId.toUpperCase(),name,'Employee',dob,email||'',department||'',designation||'',Number(salary||0),bcrypt.hashSync(dob,10));
    res.status(201).json({message:'Employee created',id:result.lastInsertRowid});
  } catch (e) {
    res.status(409).json({message:'Staff ID already exists'});
  }
});

router.delete('/:id', (req,res) => {
  const result = db.prepare("DELETE FROM users WHERE id=? AND role='Employee'").run(req.params.id);
  if (!result.changes) return res.status(404).json({message:'Employee not found'});
  res.json({message:'Employee deleted'});
});

module.exports = router;
