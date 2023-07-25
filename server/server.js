// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '.env' })

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://vikas:kFVWc4wdWtNiFKVl@cluster0.lvcltbc.mongodb.net/task?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Todo model
const Todo = mongoose.model('Todo', {
    text: String,
    completed: Boolean,
    img: String,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const todo = new Todo(req.body);
        await todo.save();
        res.json({ message: 'Todo created successfully', todo });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Todo updated successfully', todo });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
