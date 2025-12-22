import React from 'react';
import TodoItem from './TodoItem';
import Lottie from 'lottie-react';
import emptyAnim from '../animations/empty.json';
import completeAnim from '../animations/celebration.json';

const TodoList = ({ 
  todos, 
  toggleTodo, 
  deleteTodo, 
  categoryColors, 
  editingId, 
  editText, 
  setEditText, 
  onEditStart, 
  onEditCancel, 
  onEditSave,
  editCategory,
  setEditCategory,
  editDueDate,
  setEditDueDate,
  onEditDueDateSave,
  onEditCategorySave,
  onUndoDelete
}) => {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;

  if (total === 0) {
    return (
      <div className="animation-box">
        <Lottie animationData={emptyAnim} loop={true} style={{ height: 250 }} />
        <p className="status-text">No tasks yet. Add one above! 📝</p>
      </div>
    );
  }

  if (completed === total) {
    return (
      <div className="animation-box">
        <Lottie animationData={completeAnim} loop={false} style={{ height: 250 }} />
        <p className="status-text">🎉 All tasks completed!</p>
      </div>
    );
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggle={() => toggleTodo(todo.id)}
          remove={() => deleteTodo(todo.id)}
          categoryColors={categoryColors}
          isEditing={editingId === todo.id}
          editText={editText}
          setEditText={setEditText}
          onEditStart={() => onEditStart(todo)}
          onEditCancel={onEditCancel}
          onEditSave={() => onEditSave(todo.id)}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          editDueDate={editDueDate}
          setEditDueDate={setEditDueDate}
          onEditDueDateSave={() => onEditDueDateSave(todo.id)}
          onEditCategorySave={() => onEditCategorySave(todo.id)}
          onUndoDelete={onUndoDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;