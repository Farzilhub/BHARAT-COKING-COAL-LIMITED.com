// ===============================
// Current Date
// ===============================

const currentDate = document.getElementById("currentDate");

const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
};

currentDate.innerHTML = new Date().toLocaleDateString("en-IN", options);

const DASHBOARD_API_URL = "http://localhost:3000/api/dashboard";
let dashboardEmployees = [];

function formatNumber(value) {
    return Number(value).toLocaleString("en-IN");
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = value;
    }
}

function renderDashboardEmployees(employees) {
    const tableBody = document.getElementById("dashboardEmployeeTable");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = employees
        .map((employee) => `
            <tr>
                <td>
                    <img src="${employee.photo || "https://i.pravatar.cc/40"}" class="emp-img">
                </td>
                <td>${employee.employeeId}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>
                    <span class="${employee.status === "Present" ? "present" : "absent"}">
                        ${employee.status}
                    </span>
                </td>
                <td>
                    <button class="view-btn"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `)
        .join("");
}

async function loadDashboard() {
    try {
        const response = await fetch(DASHBOARD_API_URL);

        if (!response.ok) {
            throw new Error("Could not load dashboard.");
        }

        const dashboard = await response.json();
        dashboardEmployees = dashboard.recentEmployees;

        setText("totalEmployees", formatNumber(dashboard.totalEmployees));
        setText("presentToday", formatNumber(dashboard.presentToday));
        setText("absentToday", formatNumber(dashboard.absentToday));
        setText("monthlyPayroll", dashboard.monthlyPayroll);
        setText("attendanceRate", `${dashboard.attendanceRate}%`);
        setText(
            "recentEmployeeCount",
            `Showing ${dashboard.recentEmployees.length} recent employees from database`
        );

        renderDashboardEmployees(dashboard.recentEmployees);
        updateProgressBar(dashboard.attendanceRate);
    } catch (error) {
        setText("recentEmployeeCount", "Start the backend server to load dashboard data.");
    }
}


// ===============================
// Employee Search
// ===============================

function searchEmployee() {

    let input = document
        .getElementById("searchEmployee")
        .value
        .toUpperCase();

    let table = document.getElementById("employeeTable");

    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {

        let td = tr[i].getElementsByTagName("td");

        let found = false;

        for (let j = 0; j < td.length; j++) {

            if (td[j]) {

                let text = td[j].textContent || td[j].innerText;

                if (text.toUpperCase().indexOf(input) > -1) {

                    found = true;
                    break;

                }

            }

        }

        tr[i].style.display = found ? "" : "none";

    }

}


// ===============================
// Notification Bell
// ===============================

const bell = document.querySelector(".notification");

bell.addEventListener("click", function () {

    alert(
`Notifications

• New employee joined
• Attendance submitted
• Salary report generated`
    );

});


// ===============================
// Card Hover Animation
// ===============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-8px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0) scale(1)";

    });

});


// ===============================
// Quick Action Buttons
// ===============================




// ===============================
// Progress Bar Animation
// ===============================

window.addEventListener("load", () => {
    loadDashboard();

});

function updateProgressBar(rate) {
    const bar = document.querySelector(".progress-bar");

    if (!bar) {
        return;
    }

    bar.style.width = "0%";

    setTimeout(() => {
        bar.style.transition = "2s";
        bar.style.width = `${rate}%`;
    }, 300);
}


// ===============================
// Welcome Message
// ===============================

window.onload = function () {

    console.log("BCCL Dashboard Loaded Successfully");

};


