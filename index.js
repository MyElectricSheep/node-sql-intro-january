require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

// console.log(process.env)

// const { PGUSER, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } = process.env

// const pool = new Pool({
//     user: PGUSER,
//     host: PGUSER,
//     database: PGDATABASE,
//     password: PGPASSWORD,
//     port: PGPORT
// })

const pool = new Pool();

// Get all students
app.get("/api/students", (req, res) => {
  pool
    .query("SELECT * FROM students ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

// Get one students
app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;

  pool
    .query("SELECT * FROM students WHERE id=$1", [id])
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

// Create a student
app.post("/api/students", (req, res) => {
  // console.log(req.body)
  const { first_name, last_name, instructor_id, course_name } = req.body;

//   pool
//     .query(
//       "INSERT INTO students(first_name, last_name, instructor_id, course_name) VALUES($1, $2, $3, $4) RETURNING *",
//       [first_name, last_name, instructor_id, course_name]
//     )
//     .then((data) => res.json(data.rows))
//     .catch((err) => res.sendStatus(500));

    const createOneStudent = {
        text: `
        INSERT INTO students(first_name, last_name, instructor_id, course_name)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `,
        values: [first_name, last_name, instructor_id, course_name]
    }

    pool.query(createOneStudent)
        .then((data) => res.status(201).json(data.rows))
        .catch((err) => res.sendStatus(500));
});

// Update a student
app.put('/api/students/:id', (req, res) => {
    const { id } = req.params
    const { first_name, last_name, instructor_id, course_name } = req.body;

    const updateOneStudent = { 
        text: `
        UPDATE students
        SET first_name=$1, last_name=$2, instructor_id=$3, course_name=$4
        WHERE id=$5
        RETURNING *
        `,
        values: [first_name, last_name, instructor_id, course_name, id]
    }

    pool.query(updateOneStudent)
        .then((data) => res.status(200).json(data.rows))
        .catch((err) => res.sendStatus(500));    
})

// Delete a student
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params

    const deleteOneStudent = { 
        text: `DELETE FROM students WHERE id=$1 RETURNING *`,
        values: [id]
    }

    pool.query(deleteOneStudent)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.sendStatus(500));  
})

app.get("/time", (req, res) => {
  // callback syntax
  // pool.query("SELECT NOW()", (err, data) => {
  //     // console.log({
  //     //    err,
  //     //    res: res.rows
  //     // })
  //     if (err) return res.sendStatus(500)
  //     res.send(data.rows[0].now)
  // })

  // Promise syntax
  pool
    .query("SELECT NOW()")
    .then((data) => res.send(data.rows[0].now))
    .catch((err) => res.sendStatus(500));

  // async/await syntax
  // Don't forget to add async to the first callback
  // ######################################## Like that:
  // app.get('/time', async (req, res) => {
  // ########################################
  // try {
  //     const { rows } = await pool.query('SELECT NOW()')
  //     res.send(rows[0].now)
  // } catch (e) {
  //     res.sendStatus(500)
  // }
});

app.get("/", (req, res) => {
  res.send("Welcome to the NODE SQL course");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
