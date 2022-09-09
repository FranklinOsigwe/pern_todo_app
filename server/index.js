const express = require("express");
const app = express();
const cors = require("cors")
const pool = require("./db")

const port = 5000
app.use(cors())
app.use(express.json())

//ROUTES

//create todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        
        res.status(201).json(newTodo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get all todos
app.get("/todos", async (req, res) => {
    try { 
        const newTodos = await pool.query("SELECT * FROM todo")
        
        res.status(200).json(newTodos.rows)
        
    } catch (err) {
        console.error(err.message);
        
    }
})

//get a single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.status(200).json(todo.rows)
    } catch (err) {
        console.error(err.message)
    }
})


//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { description } = req.body;
        const { id } = req.params;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])
        res.json("Updated successfully")

    } catch (err) {
        console.error(err.message)
    }
})

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        // const { description } = res.body
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE  todo_id = $1", [id]);
        
        res.json("Todo was deleted")
    } catch (err) {
        console.error(err.message)
    }
})
    

app.listen(port,() => {
    console.log(`server is listening at port: ${port}` )
})