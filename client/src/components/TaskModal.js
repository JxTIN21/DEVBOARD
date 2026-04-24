import React, { useState } from 'react';
import axios from 'axios';

export default function TaskModal({ token, onTaskCreated, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' });
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const generateSubtasks = async () => {
    setAiLoading(true);
    try {
      const res = await axios.post('https://devboard-backend-dmrg.onrender.com/api/tasks/generate-subtasks',
        { title: form.title, description: form.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks(res.data.subtasks.map(s => ({ title: s, completed: false })));
    } catch (err) {
      console.error(err);
    }
    setAiLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://devboard-backend-dmrg.onrender.com/api/tasks',
        { ...form, subtasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskCreated(res.data);
    } catch (err) {
      console.error('Create task error:', err.response?.data || err.message);
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>New Task</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <input style={styles.input} placeholder="Task title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea style={styles.textarea} placeholder="Description (optional)" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={styles.row}>
          <select style={styles.input} value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select style={styles.input} value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <button style={styles.aiBtn} onClick={generateSubtasks} disabled={aiLoading || !form.title}>
          {aiLoading ? 'Generating...' : '✨ Generate Subtasks with AI'}
        </button>
        {subtasks.length > 0 && (
          <div style={styles.subtaskList}>
            <strong>Generated Subtasks:</strong>
            {subtasks.map((s, i) => (
              <div key={i} style={styles.subtask}>• {s.title}</div>
            ))}
          </div>
        )}
        <button style={styles.createBtn} onClick={handleCreate} disabled={loading || !form.title}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '8px', padding: '1.5rem', width: '450px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' },
  input: { flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  textarea: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px', resize: 'vertical' },
  row: { display: 'flex', gap: '1rem' },
  aiBtn: { padding: '0.75rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  createBtn: { padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  subtaskList: { background: '#f8f9ff', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  subtask: { marginTop: '0.25rem', color: '#444' }
};