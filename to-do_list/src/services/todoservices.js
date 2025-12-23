import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// Helper function to get user-specific collection reference
const getTodosCollection = (userId) => {
  if (!userId) throw new Error('User ID is required');
  return collection(db, `todos_${userId}`);
};

// Real-time listener
export const getTodosRealtime = (callback) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]); // Return empty array if no user
    return () => {}; // Return empty cleanup function
  }
  
  const userTodosCollection = getTodosCollection(user.uid);
  const q = query(userTodosCollection, orderBy("dueDate"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(todos);
  });
  return unsubscribe; // stop listening with this
};

// One-time fetch (optional)
export const getTodos = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  
  const userTodosCollection = getTodosCollection(user.uid);
  const snapshot = await getDocs(userTodosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new todo
export const addTodoFirebase = async (todo) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to add todos');
  
  const userTodosCollection = getTodosCollection(user.uid);
  await addDoc(userTodosCollection, todo);
};

// Delete a todo
export const deleteTodoFirebase = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to delete todos');
  
  const todoDoc = doc(db, `todos_${user.uid}`, id);
  await deleteDoc(todoDoc);
};

// Toggle completed
export const toggleTodoFirebase = async (id, completed) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to update todos');
  
  const todoDoc = doc(db, `todos_${user.uid}`, id);
  await updateDoc(todoDoc, { completed });
};

// Edit todo text
export const updateTodoFirebase = async (id, text) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to update todos');
  
  const todoDoc = doc(db, `todos_${user.uid}`, id);
  await updateDoc(todoDoc, { text });
};

// Update todo with due date
export const updateTodoDueDateFirebase = async (id, dueDate) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to update todos');
  
  const todoDoc = doc(db, `todos_${user.uid}`, id);
  await updateDoc(todoDoc, { dueDate });
};

// Update todo category
export const updateTodoCategoryFirebase = async (id, category) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to update todos');
  
  const todoDoc = doc(db, `todos_${user.uid}`, id);
  await updateDoc(todoDoc, { category });
};

// Restore deleted todo (for undo functionality)
export const restoreDeletedTodoFirebase = async (deletedTodo) => {
  if (!deletedTodo || !deletedTodo.id) return;
  
  const user = auth.currentUser;
  if (!user) throw new Error('User must be authenticated to restore todos');
  
  // If it was a new todo that was deleted before being saved to Firebase
  if (deletedTodo.tempId) {
    await addTodoFirebase({
      text: deletedTodo.text,
      completed: deletedTodo.completed,
      category: deletedTodo.category,
      emoji: deletedTodo.emoji,
      dueDate: deletedTodo.dueDate
    });
  } else {
    // Restore from Firestore (if we were using soft deletes)
    await updateDoc(doc(db, `todos_${user.uid}`, deletedTodo.id), {
      deleted: false,
      deletedAt: null
    });
  }
};

// Store deleted todos locally for undo functionality
export const storeDeletedTodo = (deletedTodo) => {
  try {
    const deletedTodos = JSON.parse(localStorage.getItem('deletedTodos') || '[]');
    const todoWithTimestamp = {
      ...deletedTodo,
      deletedAt: new Date().toISOString()
    };
    deletedTodos.unshift(todoWithTimestamp);
    
    // Keep only last 10 deleted todos and remove older than 24 hours
    const now = new Date();
    const filteredTodos = deletedTodos.filter(todo => {
      const deletedTime = new Date(todo.deletedAt);
      const hoursDiff = (now - deletedTime) / (1000 * 60 * 60);
      return hoursDiff < 24; // Keep for 24 hours
    }).slice(0, 10);
    
    localStorage.setItem('deletedTodos', JSON.stringify(filteredTodos));
    return todoWithTimestamp;
  } catch (error) {
    console.error('Error storing deleted todo:', error);
    return null;
  }
};

// Get deleted todos from localStorage
export const getDeletedTodos = () => {
  try {
    return JSON.parse(localStorage.getItem('deletedTodos') || '[]');
  } catch (error) {
    console.error('Error getting deleted todos:', error);
    return [];
  }
};

// Remove todo from deleted list (after successful undo)
export const removeFromDeletedTodos = (todoId) => {
  try {
    const deletedTodos = JSON.parse(localStorage.getItem('deletedTodos') || '[]');
    const filteredTodos = deletedTodos.filter(todo => todo.id !== todoId);
    localStorage.setItem('deletedTodos', JSON.stringify(filteredTodos));
  } catch (error) {
    console.error('Error removing from deleted todos:', error);
  }
};
