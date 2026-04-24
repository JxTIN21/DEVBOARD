import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://devboard-backend-dmrg.onrender.com/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTaskCreated = (task) => {
    setTasks([...tasks, task]);
    setShowModal(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`https://devboard-backend-dmrg.onrender.com/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://devboard-backend-dmrg.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
  };

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'inprogress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>⚡</span>
          <h2 style={styles.logo}>DevBoard</h2>
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>👤 {user?.name}</div>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Stats */}
        <div style={styles.stats}>
          {[
            { label: 'Total Tasks', value: total, color: '#4f46e5', icon: '📋' },
            { label: 'In Progress', value: inProgress, color: '#f59e0b', icon: '⚙️' },
            { label: 'Completed', value: done, color: '#10b981', icon: '✅' },
            { label: 'High Priority', value: highPriority, color: '#dc2626', icon: '🔴' },
          ].map((stat, i) => (
            <div key={i} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={{ ...styles.statNumber, color: stat.color }}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <div style={styles.toolbar}>
          <h3 style={styles.boardTitle}>My Tasks</h3>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        </div>

        <KanbanBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {showModal && (
        <TaskModal token={token} onTaskCreated={handleTaskCreated} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f7ff' },
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    padding: '1rem 2rem', color: 'white',
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)'
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: { fontSize: '1.5rem' },
  logo: { margin: 0, fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userBadge: {
    background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem',
    borderRadius: '999px', fontSize: '0.9rem', backdropFilter: 'blur(10px)'
  },
  logoutBtn: {
    background: 'white', color: '#4f46e5', border: 'none',
    padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer',
    fontWeight: '600', fontSize: '0.9rem'
  },
  body: { padding: '2rem' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: {
    background: 'white', borderRadius: '12px', padding: '1.25rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s ease',
  },
  statIcon: { fontSize: '1.5rem' },
  statNumber: { fontSize: '2rem', fontWeight: '800' },
  statLabel: { fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  boardTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#1f2937' },
  addBtn: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
    border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px',
    cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
  }
};