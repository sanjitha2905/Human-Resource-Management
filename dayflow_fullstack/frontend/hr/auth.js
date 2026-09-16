(async function(){
  try {
    const data = await dayflowApi.me();
    if (data.user.role !== 'HR') throw new Error('Forbidden');
    window.dayflowUser = data.user;
  } catch (e) {
    clearDayflowAuth();
    window.location.replace('../login/login.html');
  }
})();

window.dayflowLogout = function(){
  clearDayflowAuth();
  window.location.replace('../login/login.html');
};
