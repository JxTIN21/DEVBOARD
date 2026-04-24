const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, subtasks, priority } = req.body;
    console.log('Creating task with priority:', priority);
    const task = new Task({ user: req.user.id, title, description, status, priority, subtasks });
    const saved = await task.save();
    console.log('Saved task priority:', saved.priority);
    res.json(saved);
  } catch (err) {
    console.error('Task creation error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { returnDocument: 'after' }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Task Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// AI - Generate subtasks
router.post('/generate-subtasks', auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Always respond with only a valid JSON array of strings. No explanation, no markdown, no backticks. Just the raw JSON array.'
        },
        {
          role: 'user',
          content: `Break down this developer task into 3-5 clear actionable subtasks.
          Task: ${title}
          Description: ${description}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    let content = completion.choices[0].message.content.trim();
    
    // Strip markdown code blocks if model adds them anyway
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const subtasks = JSON.parse(content);
    res.json({ subtasks });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ message: 'Failed to generate subtasks', error: err.message });
  }
});

module.exports = router;