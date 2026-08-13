// ==============================
// Current Date
// ==============================

const dateElement = document.getElementById("currentDate");

const today = new Date();

const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
};

dateElement.innerHTML = today.toLocaleDateString("en-IN", options);

// ==============================
// Search Salary Table
// ==============================

function searchSalary() {

    let input = document.getElementById("searchSalary").value.toUpperCase();

    let table = document.getElementById("salaryTable");

    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {

        let td1 = tr[i].getElementsByTagName("td")[0];
        let td2 = tr[i].getElementsByTagName("td")[1];
        let td3 = tr[i].getElementsByTagName("td")[2];

        if (td1 || td2 || td3) {

            let txtValue =
                td1.textContent +
                td2.textContent +
                td3.textContent;

            if (txtValue.toUpperCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }

        }
    }

}

// ==============================
// Export Button
// ==============================

const exportBtn = document.querySelector(".export-btn");

if (exportBtn) {

    exportBtn.addEventListener("click", function () {

        alert("Salary report exported successfully.");

    });

}

// ==============================
// Process Salary Button
// ==============================

const processBtn = document.querySelector(".add-btn");

if (processBtn) {

    processBtn.addEventListener("click", function () {

        if (confirm("Process salary for all employees?")) {

            alert("Salary processed successfully.");

        }

    });

}

// ==============================
// View Buttons
// ==============================

document.querySelectorAll(".view-btn").forEach(button => {

    button.addEventListener("click", function () {

        alert("Viewing employee salary details.");

    });

});

// ==============================
// Edit Buttons
// ==============================

document.querySelectorAll(".edit-btn").forEach(button => {

    button.addEventListener("click", function () {

        alert("Edit salary record.");

    });

});

// ==============================
// Delete Buttons
// ==============================

document.querySelectorAll(".delete-btn").forEach(button => {

    button.addEventListener("click", function () {

        if (confirm("Delete this salary record?")) {

            alert("Salary record deleted.");

        }

    });

});

// ==============================
// Table Row Hover Effect
// ==============================

document.querySelectorAll("#salaryTable tbody tr").forEach(row => {

    row.addEventListener("mouseenter", function () {

        this.style.transition = "0.3s";
        this.style.transform = "scale(1.01)";

    });

    row.addEventListener("mouseleave", function () {

        this.style.transform = "scale(1)";

    });

});

// ==============================
// Notification Bell
// ==============================

const bell = document.querySelector(".notification");

if (bell) {

    bell.addEventListener("click", function () {

        alert("You have 5 new salary notifications.");

    });

}

console.log("BCCL Salary Management Loaded Successfully");