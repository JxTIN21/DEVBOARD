import React from 'react';
import TaskCard from './TaskCard';

const columns = [
  { id: 'todo', label: '📋 Todo', color: '#4f46e5' },
  { id: 'inprogress', label: '⚙️ In Progress', color: '#f59e0b' },
  { id: 'done', label: '✅ Done', color: '#10b981' }
];

export default function KanbanBoard({ tasks, onStatusChange, onDelete, onEdit }) {
  return (
    <div style={styles.board}>
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} style={styles.column}>
            <div style={styles.colHeader}>
              <h3 style={{ ...styles.colTitle, color: col.color }}>{col.label}</h3>
              <span style={{ ...styles.colCount, background: col.color }}>{colTasks.length}</span>
            </div>
            <div style={styles.cardList}>
              {colTasks.length === 0 && (
                <div style={styles.empty}>No tasks here</div>
              )}
              {colTasks.map(task => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  column: {
    background: 'white', borderRadius: '16px', padding: '1.25rem',
    minHeight: '500px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  colHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  colTitle: { margin: 0, fontSize: '1rem', fontWeight: '700' },
  colCount: {
    color: 'white', fontSize: '0.75rem', fontWeight: '700',
    padding: '0.2rem 0.6rem', borderRadius: '999px'
  },
  cardList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  empty: { color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }
};