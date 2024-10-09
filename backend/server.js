import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
// import employeeRoutes from "./routes/employeeRoutes.js";

const app = express();
app.use(express.json());

//configure env
dotenv.config();

//databse config
connectDB();

// Define a port to listen on
const PORT = process.env.PORT || 3000;

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/requests", requestRoutes);
// app.use("/api/v1/employee", employeeRoutes);

// Home Route (GET request)
app.get('/', (req, res) => {
    res.send('Hello, welcome to my basic Express app!');
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});