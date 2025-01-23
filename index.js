const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // is a middleware function in Express.js that parses incoming JSON palyloads in the body of HTTP request.
// It ensures that the request body(if it's in jSON formate) is automatically parsed into javascript object so your application can easily access and use the data.

const studentDataPath = path.join(__dirname, "data.json");
const students = JSON.parse(fs.readFileSync(studentDataPath, "utf8"));
// This line create the absoulute path to the file data.json so the application can locate it, regardless of the platform or working director
// utf8: ensure the file contents are read as a string using UTF-8

app.use("/students/above-threshold", (req, res) => {
  const { threshold } = req.body;
  // app.use: A method provided by Express js to handle middleware or route-specific logic.
  //'/students/above-threshold': The URL path associated with this route handler.
  // Any request to 'http://<server>/students/above-threshold will trigger this middleware/ handler.
  //(req, res)=>{...}: this is the callback function (or middleware ) executed when the route is hit.

  if (threshold < 0) {
    return res.status(400).json({ error: "Invalid threshold value" });
    //here is the condition if threshold is less than 0 error will display.
  }

  const filteredStudents = students.filter(
    (student) => student.total > threshold
  );
  //Filters the students array to include only those students whose total marks exceed the specified threshold
  const response = {
    count: filteredStudents.length,
    students: filteredStudents.map(({ name, total }) => ({
      name,
      total,
    })),
    //Uses destructuring to extract the name and total properties from each student object.
    // Creates a new object for each students with only those properties
  };
  return res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
