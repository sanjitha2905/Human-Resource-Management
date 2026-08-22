(function () {
    const role = localStorage.getItem("dayflowRole");

    // Employee pages can only be opened by an Employee login.
    if (role !== "Employee") {
        window.location.replace("../login/login.html");
        return;
    }

    window.dayflowLogout = function () {
        localStorage.clear();
        window.location.replace("../login/login.html");
    };
})();
