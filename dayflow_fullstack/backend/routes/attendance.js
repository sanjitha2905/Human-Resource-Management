const express = require('express');
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();
router.use(authenticate);

function today(){ return new Date().toISOString().slice(0,10); }
function now(){ return new Date().toISOString(); }

router.get('/me', requireRole('Employee'), (req,res) => {
  const rows = db.prepare(`SELECT work_date AS date,check_in AS checkIn,check_out AS checkOut,status
    FROM attendance WHERE user_id=? ORDER BY work_date DESC`).all(req.user.id);
  res.json({attendance:rows});
});

router.post('/check-in', requireRole('Employee'), (req,res) => {
  const d=today();
  const existing=db.prepare('SELECT * FROM attendance WHERE user_id=? AND work_date=?').get(req.user.id,d);
  if (existing && existing.check_in) return res.status(409).json({message:'Already checked in',attendance:existing});
  const t=now();
  db.prepare(`INSERT INTO attendance(user_id,work_date,check_in,status) VALUES(?,?,?,'Present')
    ON CONFLICT(user_id,work_date) DO UPDATE SET check_in=excluded.check_in,status='Present'`).run(req.user.id,d,t);
  res.json({message:'Check-in recorded',time:t});
});

router.post('/check-out', requireRole('Employee'), (req,res) => {
  const d=today();
  const existing=db.prepare('SELECT * FROM attendance WHERE user_id=? AND work_date=?').get(req.user.id,d);
  if (!existing || !existing.check_in) return res.status(400).json({message:'Check in first'});
  if (existing.check_out) return res.status(409).json({message:'Already checked out'});
  const t=now();
  db.prepare('UPDATE attendance SET check_out=? WHERE user_id=? AND work_date=?').run(t,req.user.id,d);
  res.json({message:'Check-out recorded',time:t});
});

router.get('/all', requireRole('HR'), (req,res)=>{
  const rows=db.prepare(`SELECT a.id,a.work_date AS date,a.check_in AS checkIn,a.check_out AS checkOut,a.status,
    u.staff_id AS staffId,u.name FROM attendance a JOIN users u ON u.id=a.user_id ORDER BY a.work_date DESC,a.id DESC`).all();
  res.json({attendance:rows});
});
module.exports=router;
