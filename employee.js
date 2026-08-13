const departments = [
    "Mining",
    "Finance",
    "HR",
    "IT",
    "Safety",
    "Operations"
];

const table = document.getElementById("employeeTable");

for(let i = 1; i <= 100; i++){

    let row = table.insertRow();

    row.innerHTML = `
        <td>EMP${String(i).padStart(3,'0')}</td>
        <td>Employee ${i}</td>
        <td>${departments[i % departments.length]}</td>
        <td>${i % 5 === 0 ? "Absent" : "Present"}</td>
    `;
}