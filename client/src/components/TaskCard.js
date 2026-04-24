import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const priorityConfig = {
  high: { bg: '#fee2e2', color: '#dc2626', label: '🔴 High' },
  medium: { bg: '#fef9c3', color: '#ca8a04', label: '🟡 Medium' },
  low: { bg: '#dcfce7', color: '#16a34a', label: '🟢 Low' }
};

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: task.title, description: task.description || '' });
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [hovered, setHovered] = useState(false);
  const { token } = useAuth();

  const statusOptions = ['todo', 'inprogress', 'done'];
  const completedCount = subtasks.filter(s => s.completed).length;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const handleEdit = async () => {
    try {
      const res = await axios.put(`https://devboard-backend-dmrg.onrender.com/api/tasks/${task._id}`,
        form, { headers: { Authorization: `Bearer ${token}` } }
      );
      onEdit(res.data);
      setEditing(false);
    } catch (err) { console.error(err); }
  };

  const toggleSubtask = async (index) => {
    const updated = subtasks.map((s, i) => i === index ? { ...s, completed: !s.completed } : s);
    setSubtasks(updated);
    try {
      const res = await axios.put(`https://devboard-backend-dmrg.onrender.com/api/tasks/${task._id}`,
        { subtasks: updated }, { headers: { Authorization: `Bearer ${token}` } }
      );
      onEdit(res.data);
    } catch (err) { console.error(err); }
  };

  if (editing) {
    return (
      <div style={styles.card}>
        <input style={styles.input} value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea style={styles.textarea} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={styles.editBtns}>
          <button style={styles.saveBtn} onClick={handleEdit}>Save</button>
          <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ ...styles.card, boxShadow: hovered ? '0 8px 24px rgba(79,70,229,0.15)' : '0 2px 8px rgba(0,0,0,0.06)', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Priority Badge */}
      <span style={{ ...styles.badge, background: priority.bg, color: priority.color }}>
        {priority.label}
      </span>

      {/* Header */}
      <div style={styles.header}>
        <h4 style={styles.title} onClick={() => setExpanded(!expanded)}>
          {task.title}
          <span style={styles.expandIcon}>{expanded ? ' ▲' : ' ▼'}</span>
        </h4>
        <div style={styles.actions}>
          <button style={styles.editBtn} onClick={() => setEditing(true)}>✎</button>
          <button style={styles.deleteBtn} onClick={() => onDelete(task._id)}>✕</button>
        </div>
      </div>

      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div style={styles.progressWrap}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${(completedCount / subtasks.length) * 100}%` }} />
          </div>
          <span style={styles.progressText}>{completedCount}/{subtasks.length}</span>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div style={styles.expandedContent}>
          {task.description && <p style={styles.desc}>{task.description}</p>}
          {subtasks.length > 0 && (
            <div style={styles.subtasks}>
              <p style={styles.subtaskHeader}>Subtasks</p>
              {subtasks.map((s, i) => (
                <div key={i} style={styles.subtaskRow} onClick={() => toggleSubtask(i)}>
                  <span>{s.completed ? '✅' : '⬜'}</span>
                  <span style={{ textDecoration: s.completed ? 'line-through' : 'none', color: s.completed ? '#9ca3af' : '#374151' }}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          )}
          <select style={styles.select} value={task.status}
            onChange={e => onStatusChange(task._id, e.target.value)}>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'white', border: '1px solid #ede9fe', borderRadius: '12px',
    padding: '1rem', transition: 'all 0.2s ease', cursor: 'default'
  },
  badge: {
    display: 'inline-block', fontSize: '0.7rem', padding: '0.2rem 0.6rem',
    borderRadius: '999px', fontWeight: '700', marginBottom: '0.5rem'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', cursor: 'pointer', flex: 1 },
  expandIcon: { fontSize: '0.7rem', color: '#9ca3af' },
  actions: { display: 'flex', gap: '0.4rem', marginLeft: '0.5rem' },
  editBtn: { background: '#ede9fe', border: 'none', cursor: 'pointer', color: '#4f46e5', fontSize: '0.85rem', borderRadius: '6px', padding: '0.2rem 0.5rem' },
  deleteBtn: { background: '#fee2e2', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '0.85rem', borderRadius: '6px', padding: '0.2rem 0.5rem' },
  progressWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0 0 0' },
  progressBar: { flex: 1, height: '5px', background: '#ede9fe', borderRadius: '999px' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: '999px', transition: 'width 0.3s ease' },
  progressText: { fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' },
  expandedContent: { marginTop: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem' },
  desc: { color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.75rem' },
  subtasks: { marginBottom: '0.75rem' },
  subtaskHeader: { fontSize: '0.8rem', fontWeight: '700', color: '#374151', marginBottom: '0.5rem' },
  subtaskRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.3rem 0', fontSize: '0.85rem' },
  select: { width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', background: '#f9fafb' },
  input: { width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.95rem', marginBottom: '0.5rem', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem', minHeight: '60px', resize: 'vertical', boxSizing: 'border-box' },
  editBtns: { display: 'flex', gap: '0.5rem' },
  saveBtn: { padding: '0.4rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '0.4rem 1rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};