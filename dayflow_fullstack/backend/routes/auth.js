const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticate, secret } = require('../middleware/auth');
const router = express.Router();

router.post('/login', (req,res) => {
  const { staffId, dob, role } = req.body || {};
  if (!staffId || !dob || !role) return res.status(400).json({message:'Staff ID, DOB and role are required'});
  const user = db.prepare('SELECT * FROM users WHERE staff_id=? AND role=?').get(staffId.toUpperCase(), role);
  if (!user || !bcrypt.compareSync(dob, user.password_hash)) return res.status(401).json({message:'Invalid credentials'});
  const token = jwt.sign({id:user.id, staffId:user.staff_id, name:user.name, role:user.role}, secret(), {expiresIn:'8h'});
  res.json({token, user:{id:user.id,staffId:user.staff_id,name:user.name,role:user.role,email:user.email,department:user.department,designation:user.designation}});
});

router.get('/me', authenticate, (req,res) => {
  const user = db.prepare('SELECT id,staff_id,name,role,dob,email,department,designation,salary FROM users WHERE id=?').get(req.user.id);
  if (!user) return res.status(404).json({message:'User not found'});
  res.json({user});
});

module.exports = router;
