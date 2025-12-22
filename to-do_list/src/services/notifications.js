// Notification service for todo app due date reminders

// Request notification permissions
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send a notification
export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Handle notification click
    notification.onclick = function() {
      window.focus();
      notification.close();
    };

    return notification;
  }
  return null;
};

// Schedule a reminder notification
export const scheduleReminder = (todo, reminderTime) => {
  const now = new Date();
  const reminderDate = new Date(reminderTime);
  
  const timeUntilReminder = reminderDate.getTime() - now.getTime();
  
  if (timeUntilReminder > 0) {
    setTimeout(() => {
      const isOverdue = reminderDate.getTime() < new Date().getTime();
      
      sendNotification(
        isOverdue ? '⚠️ Overdue Task' : '📅 Task Reminder',
        {
          body: `${todo.text}${isOverdue ? ' is overdue!' : ' is due soon!'}`,
          tag: `todo-${todo.id}`,
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: 'Open Todo'
            }
          ]
        }
      );
    }, timeUntilReminder);
  }
};

// Check for todos that need reminders
export const checkTodoReminders = (todos) => {
  const now = new Date();
  
  todos.forEach(todo => {
    if (!todo.dueDate || todo.completed) return;
    
    const dueDate = new Date(todo.dueDate);
    
    // 24 hour reminder
    const twentyFourHoursBefore = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    if (now >= twentyFourHoursBefore && now < dueDate) {
      scheduleReminder(todo, twentyFourHoursBefore);
    }
    
    // 1 hour reminder
    const oneHourBefore = new Date(dueDate.getTime() - 60 * 60 * 1000);
    if (now >= oneHourBefore && now < dueDate) {
      scheduleReminder(todo, oneHourBefore);
    }
    
    // Overdue notification (if due within last 24 hours)
    const twentyFourHoursAfter = new Date(dueDate.getTime() + 24 * 60 * 60 * 1000);
    if (now > dueDate && now <= twentyFourHoursAfter) {
      scheduleReminder(todo, dueDate);
    }
  });
};

// Handle notification click
export const handleNotificationClick = (event) => {
  event.notification.close();
  
  // Focus the window
  window.focus();
  
  // You can add additional logic here to navigate to specific todo
  // For now, we'll just focus the app
};

// Set up notification event listeners
export const setupNotificationListeners = () => {
  // Service worker is optional for basic notifications
  // We'll handle notification clicks through the notification options
};

// Check if notifications are supported
export const areNotificationsSupported = () => {
  return 'Notification' in window;
};

// Get current notification permission status
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Show a one-time notification for testing or welcome
export const showWelcomeNotification = () => {
  sendNotification('Welcome to Your Todo App! 📝', {
    body: 'You\'ll receive reminders for your tasks with due dates.',
    icon: '/favicon.ico'
  });
};

// Show notification settings help
export const showNotificationHelp = () => {
  sendNotification('Enable Notifications? 🔔', {
    body: 'Get reminders for your important tasks. Click to enable!',
    icon: '/favicon.ico',
    requireInteraction: false
  });
};
