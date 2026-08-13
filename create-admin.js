const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

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

function createPasswordHash(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, "sha512")
        .toString("hex");

    return `${salt}:${hash}`;
}

async function createAdmin() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing in .env.");
        process.exit(1);
    }

    if (!username || !password) {
        console.error("Set ADMIN_USERNAME and ADMIN_PASSWORD in .env first.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await User.findOneAndUpdate(
        { username },
        {
            username,
            passwordHash: createPasswordHash(password),
            role: "admin"
        },
        { upsert: true, new: true, runValidators: true }
    );

    await mongoose.disconnect();
    console.log(`Admin user "${username}" saved in MongoDB.`);
}

createAdmin().catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
});
