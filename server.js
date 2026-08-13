const path = require("path");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const departmentSchema = new mongoose.Schema(
    {
        departmentId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        head: {
            type: String,
            required: true,
            trim: true
        },
        employees: {
            type: Number,
            required: true,
            min: 0
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent"],
            default: "Present"
        },
        photo: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "admin"
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const sampleDepartments = [
    {
        departmentId: "DEP001",
        name: "Mining",
        head: "Rajesh Kumar",
        employees: 18500,
        location: "Dhanbad",
        status: "Active"
    },
    {
        departmentId: "DEP002",
        name: "Finance",
        head: "Priya Sharma",
        employees: 850,
        location: "Dhanbad",
        status: "Active"
    },
    {
        departmentId: "DEP003",
        name: "Human Resources",
        head: "Aman Singh",
        employees: 540,
        location: "Ranchi",
        status: "Active"
    },
    {
        departmentId: "DEP004",
        name: "Information Technology",
        head: "Sneha Gupta",
        employees: 720,
        location: "Kolkata",
        status: "Active"
    },
    {
        departmentId: "DEP005",
        name: "Safety",
        head: "Rohit Das",
        employees: 430,
        location: "Asansol",
        status: "Inactive"
    }
];

const sampleEmployees = [
    {
        employeeId: "EMP001",
        name: "Rahul Kumar",
        email: "rahul@bccl.in",
        department: "Mining",
        status: "Present",
        photo: "https://i.pravatar.cc/40?img=1"
    },
    {
        employeeId: "EMP002",
        name: "Priya Sharma",
        email: "priya@bccl.in",
        department: "Finance",
        status: "Present",
        photo: "https://i.pravatar.cc/40?img=5"
    },
    {
        employeeId: "EMP003",
        name: "Aman Singh",
        email: "aman@bccl.in",
        department: "Human Resources",
        status: "Absent",
        photo: "https://i.pravatar.cc/40?img=12"
    },
    {
        employeeId: "EMP004",
        name: "Rohit Das",
        email: "rohit@bccl.in",
        department: "Safety",
        status: "Present",
        photo: "https://i.pravatar.cc/40?img=15"
    },
    {
        employeeId: "EMP005",
        name: "Sneha Gupta",
        email: "sneha@bccl.in",
        department: "Information Technology",
        status: "Present",
        photo: "https://i.pravatar.cc/40?img=20"
    }
];

async function seedDepartments() {
    const count = await Department.countDocuments();

    if (count === 0) {
        await Department.insertMany(sampleDepartments);
    }
}

async function seedEmployees() {
    const count = await Employee.countDocuments();

    if (count === 0) {
        await Employee.insertMany(sampleEmployees);
    }
}

function verifyPassword(password, storedPassword) {
    const [salt, originalHash] = storedPassword.split(":");
    const hash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, "sha512")
        .toString("hex");

    return crypto.timingSafeEqual(
        Buffer.from(originalHash, "hex"),
        Buffer.from(hash, "hex")
    );
}

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        const user = await User.findOne({ username });

        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        res.json({
            message: "Login successful.",
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Could not login right now." });
    }
});

app.get("/api/dashboard", async (req, res) => {
    try {
        const [departmentTotals, presentToday, absentToday, recentEmployees] = await Promise.all([
            Department.aggregate([
                {
                    $group: {
                        _id: null,
                        totalEmployees: { $sum: "$employees" },
                        totalDepartments: { $sum: 1 },
                        activeDepartments: {
                            $sum: {
                                $cond: [{ $eq: ["$status", "Active"] }, 1, 0]
                            }
                        }
                    }
                }
            ]),
            Employee.countDocuments({ status: "Present" }),
            Employee.countDocuments({ status: "Absent" }),
            Employee.find().sort({ employeeId: 1 }).limit(5)
        ]);

        const totals = departmentTotals[0] || {
            totalEmployees: 0,
            totalDepartments: 0,
            activeDepartments: 0
        };

        const attendanceTotal = presentToday + absentToday;

        res.json({
            totalEmployees: totals.totalEmployees,
            totalDepartments: totals.totalDepartments,
            activeDepartments: totals.activeDepartments,
            presentToday,
            absentToday,
            monthlyPayroll: "Rs 4.8 Cr",
            attendanceRate: attendanceTotal === 0
                ? 0
                : Math.round((presentToday / attendanceTotal) * 100),
            recentEmployees
        });
    } catch (error) {
        res.status(500).json({ message: "Could not load dashboard data." });
    }
});

app.get("/api/departments", async (req, res) => {
    try {
        const departments = await Department.find().sort({ departmentId: 1 });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Could not load departments." });
    }
});

app.get("/api/employees", async (req, res) => {
    try {
        const employees = await Employee.find().sort({ employeeId: 1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Could not load employees." });
    }
});

app.post("/api/departments", async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({
            message: error.code === 11000
                ? "Department ID already exists."
                : "Could not add department."
        });
    }
});

app.put("/api/departments/:id", async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.json(department);
    } catch (error) {
        res.status(400).json({ message: "Could not update department." });
    }
});

app.delete("/api/departments/:id", async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ message: "Department not found." });
        }

        res.json({ message: "Department deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Could not delete department." });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "department.html"));
});

async function startServer() {
    if (!process.env.MONGODB_URI) {
        console.error("Missing MONGODB_URI. Create a .env file using .env.example.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await seedDepartments();
        await seedEmployees();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Could not connect to MongoDB.");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
