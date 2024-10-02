const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
const cors = require('cors')
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
