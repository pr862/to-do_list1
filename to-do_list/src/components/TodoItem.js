import React from 'react';
import DatePicker from 'react-datepicker';

const TodoItem = ({
  todo,
  toggle,
  remove,
  categoryColors,
  isEditing,
  editText,
  setEditText,
  editCategory = 'General',
  setEditCategory = () => {},
  editDueDate,
  setEditDueDate,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditDueDateSave,
  onEditCategorySave
}) => {
  const color = categoryColors[todo.category] || '#999';

  // Helper function to get due date status
  const getDueDateStatus = (dueDateString) => {
    if (!dueDateString) return null;
    
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate < today) {
      return { status: 'overdue', color: '#e53935', icon: '⚠️' };
    } else if (taskDate.getTime() === today.getTime()) {
      return { status: 'today', color: '#ff9800', icon: '📅' };
    } else {
      return { status: 'future', color: '#4caf50', icon: '🗓️' };
    }
  };

  const dueDateStatus = getDueDateStatus(todo.dueDate);

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                marginBottom: '6px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{
                  borderRadius: '6px',
                  padding: '6px',
                  fontWeight: '500',
                  flex: 1
                }}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
              </select>
              <DatePicker
                selected={editDueDate}
                onChange={(date) => setEditDueDate(date)}
                placeholderText="📅 No due date"
                dateFormat="MMM dd, yyyy"
                minDate={new Date()}
                className="edit-date-picker"
                popperClassName="date-picker-popper"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={onEditSave} className="btn-icon">💾</button>
              <button onClick={onEditCancel} className="btn-icon">❌</button>
            </div>
          </>
        ) : (
          <>
            <span>
              {todo.emoji && <span style={{ marginRight: '8px' }}>{todo.emoji}</span>}
              {todo.text}
            </span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
              <small style={{ color, fontWeight: 'bold' }}>
                📁 {todo.category}
              </small>
              {dueDateStatus && (
                <small style={{ 
                  color: dueDateStatus.color, 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>{dueDateStatus.icon}</span>
                  {new Date(todo.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </small>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggle} className="btn-icon">
            {todo.completed ? '↩️' : '✅'}
          </button>
          <button onClick={onEditStart} className="btn-icon">✍️</button>
          <button onClick={remove} className="btn-icon">🗑️</button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
