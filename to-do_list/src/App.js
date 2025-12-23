import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import EmojiPicker from 'emoji-picker-react';
import TodoList from './components/TodoList';
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

import { 
  getTodosRealtime, 
  addTodoFirebase, 
  deleteTodoFirebase, 
  toggleTodoFirebase, 
  updateTodoFirebase,
  updateTodoDueDateFirebase,
  updateTodoCategoryFirebase
} from './services/todoservices';

import { 
  requestNotificationPermission, 
  checkTodoReminders, 
  setupNotificationListeners,
  areNotificationsSupported,
  getNotificationPermission,
  showWelcomeNotification
} from './services/notifications';

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// TodoApp Component - separate to avoid re-renders
const TodoApp = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('General');
  const [emoji, setEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [editDueDate, setEditDueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const categoryColors = {
    General: '#888',
    Work: '#00bcd4',
    Personal: '#ff9800',
    Urgent: '#e53935'
  };

  // 🔥 Firestore realtime listener (only when user is authenticated)
  useEffect(() => {
    if (user) {
      const unsubscribe = getTodosRealtime(setTodos);
      return () => unsubscribe();
    } else {
      setTodos([]); // Clear todos when user logs out
    }
  }, [user]);

  // Initialize notifications and check for reminders
  useEffect(() => {
    // Check if notifications are supported
    if (areNotificationsSupported()) {
      const permission = getNotificationPermission();
      setNotificationsEnabled(permission === 'granted');
      
      // Set up notification listeners
      setupNotificationListeners();
    }
  }, []);

  // Check for todo reminders whenever todos change
  useEffect(() => {
    if (todos.length > 0 && notificationsEnabled) {
      checkTodoReminders(todos);
    }
  }, [todos, notificationsEnabled]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        showWelcomeNotification();
      }
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    await addTodoFirebase({
      text: input.trim(),
      completed: false,
      category,
      emoji: emoji || '',
      dueDate: dueDate ? dueDate.toISOString() : null
    });
    setInput('');
    setEmoji('');
    setDueDate(null);
  };

  const toggleTodo = async (id, completed) => {
    await toggleTodoFirebase(id, !completed);
  };

  const deleteTodo = async (id) => {
    await deleteTodoFirebase(id);
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    for (let todo of completedTodos) {
      await deleteTodoFirebase(todo.id);
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditCategory(todo.category || 'General');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    await updateTodoFirebase(id, editText.trim());
    setEditingId(null);
    setEditText('');
    setEditCategory('General');
    setEditDueDate(null);
  };

  const handleEditDueDateSave = async (id) => {
    await updateTodoDueDateFirebase(id, editDueDate ? editDueDate.toISOString() : null);
  };

  const handleEditCategorySave = async (id) => {
    await updateTodoCategoryFirebase(id, editCategory);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
    setEditCategory('General');
    setEditDueDate(null);
  };


  const filteredTodos = todos.filter(todo =>
    (todo.text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1>My Creative Todo ✨</h1>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {areNotificationsSupported() && (
            <button
              onClick={toggleNotifications}
              className="btn-secondary"
              style={{
                backgroundColor: notificationsEnabled ? '#4caf50' : '#ff9800'
              }}
            >
              {notificationsEnabled ? '🔔' : '🔕'} 
              {notificationsEnabled ? 'On' : 'Off'}
            </button>
          )}
          <span style={{ 
            color: '#666',
            fontSize: '14px'
          }}>
            {user.email}
          </span>
          <button 
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          marginBottom: '15px',
          fontSize: '16px',
          border: '2px solid #ccc'
        }}
      />

      <div className="input-container" style={{ position: 'relative' }}>
        <input
          type="text"
          value={input}
          placeholder="Add a task..."
          onChange={(e) => setInput(e.target.value)}
          className="main-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            borderRadius: '10px',
            padding: '12px',
            fontWeight: '600'
          }}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>

        <div className="date-picker-container">
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            placeholderText="📅 Due date"
            dateFormat="MMM dd, yyyy"
            minDate={new Date()}
            className="date-picker-input"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="btn-secondary"
          style={{
            fontSize: '18px'
          }}
        >
          {emoji || '😀'}
        </button>

        {showEmojiPicker && (
          <div style={{ position: 'absolute', top: '100%', zIndex: 999 }}>
            <EmojiPicker
              onEmojiClick={(e) => {
                setEmoji(e.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}

        <button onClick={addTodo} className="btn-primary">Add</button>
      </div>

      {todos.some(todo => todo.completed) && (
        <button onClick={clearCompleted} className="btn-utility">
          🧹 Clear Completed
        </button>
      )}

      <TodoList
        todos={filteredTodos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        categoryColors={categoryColors}
        editingId={editingId}
        editText={editText}
        setEditText={setEditText}
        onEditStart={handleEditStart}
        onEditCancel={handleEditCancel}
        onEditSave={handleEditSave}
        editCategory={editCategory}
        setEditCategory={setEditCategory}
        editDueDate={editDueDate}
        setEditDueDate={setEditDueDate}
        onEditDueDateSave={handleEditDueDateSave}
        onEditCategorySave={handleEditCategorySave}
      
      />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // 🔐 Auth state listener - only initialize once
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthInitialized(true);
    });

    return () => unsubscribeAuth();
  }, []);

  // Public Route Wrapper - for routes that don't require auth
  const PublicRoute = ({ children }) => {
    // If user is authenticated and trying to access login/register, redirect to todo
    if (authInitialized && user) {
      return <Navigate to="/todo" />;
    }
    // Otherwise show the public content
    return children;
  };

  // Protected Route Component - only for authenticated users
  const ProtectedRoute = ({ children }) => {
    // If auth is not initialized or no user, redirect to login
    if (!authInitialized || !user) {
      return <Navigate to="/login" />;
    }
    
    // Only show content when we have confirmed auth
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route goes to login (no redirect needed) */}
        <Route path="/" element={<Login />} />
        
        {/* Public routes - redirect authenticated users to todo */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* ✅ MAIN TODO APP - Protected route */}
        <Route 
          path="/todo" 
          element={
            <ProtectedRoute>
              <TodoApp user={user} />
            </ProtectedRoute>
          } 
        />

        {/* Catch all other routes - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
