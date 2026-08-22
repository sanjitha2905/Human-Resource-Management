(function () {
    const role = localStorage.getItem("dayflowRole");

    // HR pages can only be opened by an HR login.
    if (role !== "HR") {
        window.location.replace("../login/login.html");
        return;
    }

    window.dayflowLogout = function () {
        localStorage.clear();
        window.location.replace("../login/login.html");
    };
})();
