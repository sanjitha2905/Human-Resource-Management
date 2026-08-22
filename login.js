// Current selected role

let selectedRole = "HR";


// ================= ROLE SELECTION =================

function selectRole(role) {

    selectedRole = role;


    const hrBtn =
        document.getElementById("hrBtn");

    const employeeBtn =
        document.getElementById("employeeBtn");


    const idLabel =
        document.getElementById("idLabel");

    const staffId =
        document.getElementById("staffId");

    const demoText =
        document.getElementById("demoText");


    // HR

    if (role === "HR") {

        hrBtn.classList.add("active");

        employeeBtn.classList.remove("active");


        idLabel.innerText =
            "HR Staff ID";

        staffId.placeholder =
            "Enter HR Staff ID";


        demoText.innerHTML =
            `
            HR ID: HR001<br>
            DOB: 1990-05-15
            `;

    }


    // EMPLOYEE

    else {

        employeeBtn.classList.add("active");

        hrBtn.classList.remove("active");


        idLabel.innerText =
            "Employee Staff ID";

        staffId.placeholder =
            "Enter Employee Staff ID";


        demoText.innerHTML =
            `
            Employee 1: EMP001 | DOB: 2000-04-10<br>
            Employee 2: EMP002 | DOB: 1999-08-22
            `;

    }

}



// ================= LOGIN =================

function login(event) {

    event.preventDefault();


    const staffId =
        document
            .getElementById("staffId")
            .value
            .trim()
            .toUpperCase();


    const dob =
        document
            .getElementById("dob")
            .value;


    const message =
        document.getElementById("message");


    // ================= HR LOGIN =================

    if (selectedRole === "HR") {

        if (
            staffId === "HR001" &&
            dob === "1990-05-15"
        ) {

            message.style.color =
                "#15803d";

            message.innerText =
                "✅ HR Login successful!";

            localStorage.setItem("dayflowRole", "HR");


            setTimeout(function() {

                window.location.href =
                    "../hr/index.html";

            }, 700);


        } else {

            message.style.color =
                "#dc2626";

            message.innerText =
                "❌ Invalid HR Staff ID or Date of Birth.";

        }

    }


    // ================= EMPLOYEE LOGIN =================

    else {

        if (
            staffId === "EMP001" &&
            dob === "2000-04-10"
        ) {

            employeeLogin(
                "EMP001",
                "Arun Kumar"
            );

        }


        else if (
            staffId === "EMP002" &&
            dob === "1999-08-22"
        ) {

            employeeLogin(
                "EMP002",
                "Priya S"
            );

        }


        else {

            message.style.color =
                "#dc2626";

            message.innerText =
                "❌ Invalid Employee Staff ID or Date of Birth.";

        }

    }

}



// ================= EMPLOYEE SUCCESS =================

function employeeLogin(id, name) {

    const message =
        document.getElementById("message");


    message.style.color =
        "#15803d";

    message.innerText =
        "✅ Employee Login successful!";


    // Save login information

    localStorage.setItem("dayflowRole", "Employee");

    localStorage.setItem(
        "employeeId",
        id
    );

    localStorage.setItem(
        "employeeName",
        name
    );


    setTimeout(function() {

        window.location.href =
            "../employee/index.html";

    }, 700);

}