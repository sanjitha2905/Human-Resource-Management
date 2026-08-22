let selectedRole = 'HR';

function selectRole(role) {
  selectedRole = role;
  document.getElementById('hrBtn').classList.toggle('active', role === 'HR');
  document.getElementById('employeeBtn').classList.toggle('active', role === 'Employee');
  document.getElementById('idLabel').innerText = role === 'HR' ? 'HR Staff ID' : 'Employee Staff ID';
  document.getElementById('staffId').placeholder = role === 'HR' ? 'Enter HR Staff ID' : 'Enter Employee Staff ID';
  document.getElementById('demoText').innerHTML = role === 'HR'
    ? 'HR ID: HR001<br>DOB: 1990-05-15'
    : 'Employee 1: EMP001 | DOB: 2000-04-10<br>Employee 2: EMP002 | DOB: 1999-08-22';
}

async function login(event) {
  event.preventDefault();
  const staffId = document.getElementById('staffId').value.trim().toUpperCase();
  const dob = document.getElementById('dob').value;
  const message = document.getElementById('message');
  message.style.color = '#475569';
  message.innerText = 'Signing in...';
  try {
    const result = await dayflowApi.login(staffId, dob, selectedRole);
    localStorage.setItem('dayflowToken', result.token);
    localStorage.setItem('dayflowRole', result.user.role);
    localStorage.setItem('employeeId', result.user.staffId);
    localStorage.setItem('employeeName', result.user.name);
    message.style.color = '#15803d';
    message.innerText = `✅ ${result.user.role} Login successful!`;
    setTimeout(() => {
      window.location.href = result.user.role === 'HR' ? '../hr/index.html' : '../employee/index.html';
    }, 400);
  } catch (error) {
    message.style.color = '#dc2626';
    message.innerText = `❌ ${error.message}`;
  }
}
