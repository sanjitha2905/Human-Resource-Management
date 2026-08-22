function showPage(pageId, button = null) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
  const selected = document.getElementById(pageId);
  if (selected) selected.classList.add('active-page');
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (button) button.classList.add('active');
  const titles = {dashboard:'HR Dashboard',employees:'Employee Management',attendance:'Attendance Management',leaves:'Leave Requests',payroll:'Payroll Management',reports:'Reports & Analytics'};
  const title=document.getElementById('pageTitle'); if(title) title.innerText=titles[pageId]||'HR Dashboard';
}
function searchEmployees(){
  const filter=(document.getElementById('employeeSearch')?.value||'').toLowerCase();
  document.querySelectorAll('#employeeTable tbody tr').forEach(row=>row.style.display=row.innerText.toLowerCase().includes(filter)?'':'none');
}
function logout(){ if(window.dayflowLogout) window.dayflowLogout(); }

async function loadEmployees(){
  try{
    const {employees}=await dayflowApi.employees();
    const body=document.querySelector('#employeeTable tbody'); if(!body)return;
    body.innerHTML=employees.map(e=>`<tr><td>${e.staffId}</td><td><div class="employee-name"><div class="mini-avatar">${e.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>${e.name}</div></td><td>${e.department||'-'}</td><td>${e.designation||'-'}</td><td><span class="badge active">Active</span></td><td><button class="view-btn" onclick="alert('Employee: ${e.name}\\nID: ${e.staffId}\\nEmail: ${e.email||'-'}')">View</button></td></tr>`).join('');
  }catch(e){console.error(e)}
}
async function loadHRLeaves(){
  try{
    const {leaves}=await dayflowApi.allLeaves();
    const table=document.querySelector('#leaveTable'); if(!table)return;
    const body=table.querySelector('tbody');
    if(!body)return;
    body.innerHTML=leaves.map(l=>`<tr><td>${l.name}<br><small>${l.staffId}</small></td><td>${l.leaveType}</td><td>${l.startDate}</td><td>${l.endDate}</td><td>${l.remarks||'-'}</td><td><span class="badge ${l.status.toLowerCase()}">${l.status}</span></td><td>${l.status==='Pending'?`<button class="approve-btn" onclick="setLeaveStatus(${l.id},'Approved')">Approve</button> <button class="reject-btn" onclick="setLeaveStatus(${l.id},'Rejected')">Reject</button>`:'-'}</td></tr>`).join('');
  }catch(e){console.error(e)}
}
async function setLeaveStatus(id,status){
  try{await dayflowApi.updateLeave(id,status); alert(`Leave ${status.toLowerCase()} successfully!`); loadHRLeaves();}catch(e){alert(e.message)}
}
async function loadHRAttendance(){
  try{
    const {attendance}=await dayflowApi.allAttendance();
    const page=document.getElementById('attendance'); const table=page?.querySelector('table'); if(!table)return;
    const body=table.querySelector('tbody'); if(!body)return;
    body.innerHTML=attendance.map(a=>`<tr><td>${a.name}</td><td>${a.checkIn?new Date(a.checkIn).toLocaleTimeString():'--'}</td><td>${a.checkOut?new Date(a.checkOut).toLocaleTimeString():'--'}</td><td>--</td><td><span class="badge approved">${a.status}</span></td></tr>`).join('');
  }catch(e){console.error(e)}
}
async function loadHRPayroll(){
  try{
    const {payroll}=await dayflowApi.allPayroll();
    const page=document.getElementById('payroll'); const table=page?.querySelector('table'); if(!table)return;
    const body=table.querySelector('tbody'); if(!body)return;
    body.innerHTML=payroll.map(p=>`<tr><td>${p.staffId}</td><td>${p.name}</td><td>₹${Number(p.basicSalary).toLocaleString('en-IN')}</td><td>₹${Number(p.allowances).toLocaleString('en-IN')}</td><td>₹${Number(p.deductions).toLocaleString('en-IN')}</td><td>₹${Number(p.netSalary).toLocaleString('en-IN')}</td><td><button class="view-btn">View</button></td></tr>`).join('');
  }catch(e){console.error(e)}
}

document.addEventListener('DOMContentLoaded',()=>{
  loadEmployees(); loadHRLeaves(); loadHRAttendance(); loadHRPayroll();
});
