const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'data', 'dayflow.db'));
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('HR','Employee')),
  dob TEXT NOT NULL,
  email TEXT,
  department TEXT,
  designation TEXT,
  salary REAL DEFAULT 0,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  work_date TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT NOT NULL DEFAULT 'Present',
  UNIQUE(user_id, work_date),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  remarks TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS payroll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  basic_salary REAL NOT NULL,
  allowances REAL NOT NULL DEFAULT 0,
  deductions REAL NOT NULL DEFAULT 0,
  UNIQUE(user_id, month),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (count === 0) {
  const insert = db.prepare(`INSERT INTO users
    (staff_id,name,role,dob,email,department,designation,salary,password_hash)
    VALUES (?,?,?,?,?,?,?,?,?)`);
  const password = (dob) => bcrypt.hashSync(dob, 10);
  insert.run('HR001','HR Administrator','HR','1990-05-15','hr@dayflow.local','Human Resources','HR Manager',65000,password('1990-05-15'));
  insert.run('EMP001','Arun Kumar','Employee','2000-04-10','arun@dayflow.local','Engineering','Software Engineer',33000,password('2000-04-10'));
  insert.run('EMP002','Priya S','Employee','1999-08-22','priya@dayflow.local','Testing','QA Engineer',36000,password('1999-08-22'));
  const payroll = db.prepare('INSERT INTO payroll(user_id,month,basic_salary,allowances,deductions) VALUES(?,?,?,?,?)');
  const employees = db.prepare("SELECT id,salary FROM users WHERE role='Employee'").all();
  for (const e of employees) payroll.run(e.id,'2026-08',e.salary - 5000,5000,2000);
}

module.exports = db;
