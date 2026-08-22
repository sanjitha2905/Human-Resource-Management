const express = require('express');
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();
router.use(authenticate);

router.get('/me', requireRole('Employee'), (req,res)=>{
  const rows=db.prepare(`SELECT id,leave_type AS leaveType,start_date AS startDate,end_date AS endDate,remarks,status,created_at AS createdAt
    FROM leaves WHERE user_id=? ORDER BY id DESC`).all(req.user.id);
  res.json({leaves:rows});
});

router.post('/', requireRole('Employee'), (req,res)=>{
  const {leaveType,startDate,endDate,remarks}=req.body||{};
  if(!leaveType||!startDate||!endDate) return res.status(400).json({message:'Leave type and dates are required'});
  if(endDate<startDate) return res.status(400).json({message:'End date cannot be before start date'});
  const r=db.prepare(`INSERT INTO leaves(user_id,leave_type,start_date,end_date,remarks) VALUES(?,?,?,?,?)`).run(req.user.id,leaveType,startDate,endDate,remarks||'');
  res.status(201).json({message:'Leave request submitted',id:r.lastInsertRowid});
});

router.get('/', requireRole('HR'), (req,res)=>{
  const rows=db.prepare(`SELECT l.id,l.leave_type AS leaveType,l.start_date AS startDate,l.end_date AS endDate,l.remarks,l.status,
    u.staff_id AS staffId,u.name FROM leaves l JOIN users u ON u.id=l.user_id ORDER BY l.id DESC`).all();
  res.json({leaves:rows});
});

router.patch('/:id/status', requireRole('HR'), (req,res)=>{
  const {status}=req.body||{};
  if(!['Approved','Rejected','Pending'].includes(status)) return res.status(400).json({message:'Invalid status'});
  const r=db.prepare('UPDATE leaves SET status=? WHERE id=?').run(status,req.params.id);
  if(!r.changes) return res.status(404).json({message:'Leave request not found'});
  res.json({message:`Leave ${status.toLowerCase()}`});
});
module.exports=router;
