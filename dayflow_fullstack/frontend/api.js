const API_BASE = 'http://localhost:3000/api';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('dayflowToken');
  const headers = {'Content-Type': 'application/json', ...(options.headers || {})};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, {...options, headers});
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

const dayflowApi = {
  login: (staffId, dob, role) => apiRequest('/auth/login', {method:'POST', body:JSON.stringify({staffId,dob,role})}),
  me: () => apiRequest('/auth/me'),
  employees: () => apiRequest('/employees'),
  createEmployee: (payload) => apiRequest('/employees', {method:'POST',body:JSON.stringify(payload)}),
  deleteEmployee: (id) => apiRequest(`/employees/${id}`, {method:'DELETE'}),
  myAttendance: () => apiRequest('/attendance/me'),
  allAttendance: () => apiRequest('/attendance/all'),
  checkIn: () => apiRequest('/attendance/check-in',{method:'POST'}),
  checkOut: () => apiRequest('/attendance/check-out',{method:'POST'}),
  myLeaves: () => apiRequest('/leaves/me'),
  createLeave: (payload) => apiRequest('/leaves',{method:'POST',body:JSON.stringify(payload)}),
  allLeaves: () => apiRequest('/leaves'),
  updateLeave: (id,status) => apiRequest(`/leaves/${id}/status`,{method:'PATCH',body:JSON.stringify({status})}),
  myPayroll: () => apiRequest('/payroll/me'),
  allPayroll: () => apiRequest('/payroll')
};

function clearDayflowAuth(){
  localStorage.removeItem('dayflowToken');
  localStorage.removeItem('dayflowRole');
  localStorage.removeItem('employeeId');
  localStorage.removeItem('employeeName');
}
