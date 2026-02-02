import express from "express";
import fs from "fs";

const app = express();
app.use(express.json()); 

const FILE = "./students.json";

const readStudents = () => {
  const data = fs.readFileSync(FILE, "utf-8");
  return JSON.parse(data);
};

const writeStudents = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

app.post("/students", (req, res) => {
  const students = readStudents();
  const newStudent = req.body;

  students.push(newStudent);
  writeStudents(students);

  res.send("Student added");
});

app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).send("Student not found");
  }

  res.json(student);
});

app.put("/students/:id", (req, res) => {
  const students = readStudents();
  const id = req.params.id;

  const updatedStudents = students.map(s =>
    s.id == id
      ? {
          ...s,
          name: req.body.name,
          email: req.body.email,
          course: req.body.course
        }
      : s
  );

  writeStudents(updatedStudents);
  res.send("Student updated");
});

app.delete("/students/:id", (req, res) => {
  const students = readStudents();
  const updatedStudents = students.filter(s => s.id != req.params.id);

  writeStudents(updatedStudents);
  res.send("Student deleted");
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
