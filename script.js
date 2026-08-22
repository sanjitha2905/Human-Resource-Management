// ================= PAGE NAVIGATION =================

function showPage(pageId, button = null) {

    // Hide all pages

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active-page");
    });


    // Show selected page

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    // Remove active class from menu

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    // Add active class

    if (button) {
        button.classList.add("active");
    }


    // Change title

    const titles = {

        dashboard: "HR Dashboard",

        employees: "Employee Management",

        attendance: "Attendance Management",

        leaves: "Leave Requests",

        payroll: "Payroll Management",

        reports: "Reports & Analytics"

    };


    document.getElementById("pageTitle").innerText =
        titles[pageId] || "HR Dashboard";
}



// ================= EMPLOYEE SEARCH =================

function searchEmployees() {

    const input =
        document.getElementById("employeeSearch");

    const filter =
        input.value.toLowerCase();

    const table =
        document.getElementById("employeeTable");

    const rows =
        table.getElementsByTagName("tbody")[0]
            .getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        const text =
            rows[i].innerText.toLowerCase();

        if (text.includes(filter)) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }
    }
}



// ================= LEAVE APPROVAL =================

function approveLeave(button) {

    const row = button.closest("tr");

    const status =
        row.querySelector(".badge");

    status.innerText = "Approved";

    status.className = "badge approved";


    // Remove buttons

    button.remove();

    const rejectButton =
        row.querySelector(".reject-btn");

    if (rejectButton) {
        rejectButton.remove();
    }

    alert("Leave request approved successfully!");
}



// ================= LEAVE REJECTION =================

function rejectLeave(button) {

    const row = button.closest("tr");

    const status =
        row.querySelector(".badge");

    status.innerText = "Rejected";

    status.className = "badge rejected";


    // Remove buttons

    button.remove();

    const approveButton =
        row.querySelector(".approve-btn");

    if (approveButton) {
        approveButton.remove();
    }

    alert("Leave request rejected.");
}



// ================= LOGOUT =================

function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        // Change this later to your login page

        window.location.href = "index.html";
    }
}