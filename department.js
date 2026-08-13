// ===============================
// Current Date
// ===============================

const currentDate = document.getElementById("currentDate");

if (currentDate) {
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    currentDate.innerHTML =
        new Date().toLocaleDateString("en-IN", options);
}

const API_URL = "http://localhost:3000/api/departments";
const departmentTableBody = document.querySelector("#departmentTable tbody");
let departments = [];

// ===============================
// Department Search
// ===============================

function searchDepartment() {
    const input = document
        .getElementById("searchDepartment")
        .value
        .toUpperCase();

    const table = document.getElementById("departmentTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td");
        let found = false;

        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const text = td[j].textContent || td[j].innerText;

                if (text.toUpperCase().indexOf(input) > -1) {
                    found = true;
                    break;
                }
            }
        }

        tr[i].style.display = found ? "" : "none";
    }
}

function formatNumber(value) {
    return Number(value).toLocaleString("en-IN");
}

function renderDepartments() {
    if (!departmentTableBody) {
        return;
    }

    departmentTableBody.innerHTML = departments
        .map((department) => `
            <tr data-id="${department._id}">
                <td>${department.departmentId}</td>
                <td>${department.name}</td>
                <td>${department.head}</td>
                <td>${formatNumber(department.employees)}</td>
                <td>${department.location}</td>
                <td>
                    <span class="${department.status === "Active" ? "present" : "absent"}">
                        ${department.status}
                    </span>
                </td>
                <td>
                    <button class="view-btn" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

async function loadDepartments() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Request failed");
        }

        departments = await response.json();
        renderDepartments();
    } catch (error) {
        alert("Could not load departments. Start the backend server first.");
    }
}

function getDepartmentInput(existingDepartment = {}) {
    const departmentId = prompt("Department ID", existingDepartment.departmentId || "");

    if (!departmentId) {
        return null;
    }

    const name = prompt("Department Name", existingDepartment.name || "");
    const head = prompt("Department Head", existingDepartment.head || "");
    const employees = prompt("Number of Employees", existingDepartment.employees || "0");
    const location = prompt("Location", existingDepartment.location || "");
    const status = prompt("Status: Active or Inactive", existingDepartment.status || "Active");

    if (!name || !head || !location) {
        alert("Department name, head, and location are required.");
        return null;
    }

    return {
        departmentId,
        name,
        head,
        employees: Number(employees),
        location,
        status: status === "Inactive" ? "Inactive" : "Active"
    };
}

async function addDepartment() {
    const payload = getDepartmentInput();

    if (!payload) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        await loadDepartments();
    } catch (error) {
        alert(error.message || "Could not add department.");
    }
}

async function editDepartment(department) {
    const payload = getDepartmentInput(department);

    if (!payload) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${department._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Could not update department.");
        }

        await loadDepartments();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteDepartment(department) {
    if (!confirm(`Delete ${department.name}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${department._id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete department.");
        }

        await loadDepartments();
    } catch (error) {
        alert(error.message);
    }
}

// ===============================
// Notification
// ===============================

const bell = document.querySelector(".notification");

if (bell) {

    bell.addEventListener("click", function () {

        alert(
`Notifications

• New Department Added
• HR Department Updated
• Safety Department Report Ready`
        );

    });

}

// ===============================
// Add Department
// ===============================

const addBtn = document.querySelector(".add-btn");

if (addBtn) {

    addBtn.addEventListener("click", function () {

        addDepartment();

    });

}

// ===============================
// Export
// ===============================

const exportBtn = document.querySelector(".export-btn");

if (exportBtn) {

    exportBtn.addEventListener("click", function () {

        alert("Export feature coming soon.");

    });

}

if (departmentTableBody) {
    departmentTableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const row = button.closest("tr");
        const department = departments.find((item) => item._id === row.dataset.id);

        if (!department) {
            return;
        }

        if (button.dataset.action === "view") {
            alert(
`Department Details

ID: ${department.departmentId}
Name: ${department.name}
Head: ${department.head}
Employees: ${formatNumber(department.employees)}
Location: ${department.location}
Status: ${department.status}`
            );
        }

        if (button.dataset.action === "edit") {
            editDepartment(department);
        }

        if (button.dataset.action === "delete") {
            deleteDepartment(department);
        }
    });
}

// ===============================
// Dashboard Loaded
// ===============================

window.onload = function () {

    console.log("BCCL Department Dashboard Loaded Successfully");
    loadDepartments();

};

