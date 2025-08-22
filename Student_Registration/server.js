import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); 

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection error:", err));

// Defining Schema for students
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  rollNo: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// API route for registration
app.post("/api/register", async (req, res) => {
  const { name, email, rollNo } = req.body;

  if (!name || !email || !rollNo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message:
          existingStudent.email === email
            ? "Email already registered"
            : "Roll No already registered",
      });
    }

    const newStudent = new Student({ name, email, rollNo });
    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving to database" });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
