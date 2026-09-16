const express = require('express');
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const router=express.Router();
router.use(authenticate);

router.get('/me', requireRole('Employee'), (req,res)=>{
 const rows=db.prepare(`SELECT month,basic_salary AS basicSalary,allowances,deductions,
   (basic_salary+allowances-deductions) AS netSalary FROM payroll WHERE user_id=? ORDER BY month DESC`).all(req.user.id);
 res.json({payroll:rows});
});
router.get('/', requireRole('HR'), (req,res)=>{
 const rows=db.prepare(`SELECT p.month,p.basic_salary AS basicSalary,p.allowances,p.deductions,
   (p.basic_salary+p.allowances-p.deductions) AS netSalary,u.staff_id AS staffId,u.name
   FROM payroll p JOIN users u ON u.id=p.user_id ORDER BY p.month DESC,u.name`).all();
 res.json({payroll:rows});
});
module.exports=router;
