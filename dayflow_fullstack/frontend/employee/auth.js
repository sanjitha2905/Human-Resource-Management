(async function(){
  try {
    const data = await dayflowApi.me();
    if (data.user.role !== 'Employee') throw new Error('Forbidden');
    window.dayflowUser = data.user;
    document.querySelectorAll('[data-employee-name]').forEach(el => el.textContent = data.user.name);
  } catch (e) {
    clearDayflowAuth();
    window.location.replace('../login/login.html');
  }
})();

window.dayflowLogout = function(){
  clearDayflowAuth();
  window.location.replace('../login/login.html');
};
