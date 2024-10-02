const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// Get all todos for a user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new todo
router.post("/create", auth, async (req, res) => {
  const { title } = req.body;

  try {
    const newTodo = new Todo({ userId: req.user, title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.title = req.body.title || todo.title;
    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user });
    if (!todo) {
      console.error(`Todo not found ${req.params.id}`);
      return res.status(404).json({ message: "Todo not found" });
    }

    
    await todo.deleteOne(); 
    res.json({ message: "Todo removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
