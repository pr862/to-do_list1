# Todo List Application

A modern, feature-rich todo list application built with React and Firebase. This app allows users to manage their tasks with a beautiful, responsive interface and real-time synchronization.

## ✨ Features

- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🔥 **Firebase Integration** - Real-time data synchronization and user authentication
- 🎨 **Beautiful Animations** - Smooth transitions and visual feedback using Lottie animations
- 📅 **Due Date Scheduling** - Set and track due dates for your todos
- 🎯 **Emoji Support** - Express yourself with emoji picker integration
- ✅ **Task Management** - Add, edit, delete, and mark todos as complete
- 🔐 **User Authentication** - Secure login and registration system
- 📊 **Progress Tracking** - Visual feedback with celebration animations
- 🌙 **Modern UI** - Clean and intuitive user interface

## 🚀 Live Demo

The app is deployed and available at: [https://pr862.github.io/to-do_list](https://pr862.github.io/to-do_list)

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3 with custom animations
- **Backend**: Firebase (Authentication, Firestore)
- **UI Components**: React Datepicker, Emoji Picker React
- **Animations**: Lottie React
- **Deployment**: GitHub Pages
- **Build Tool**: Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pr862/to-do_list1.git
cd to-do_list1
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update the Firebase configuration in `src/firebase.js`

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📱 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run deploy`
Deploys the built app to GitHub Pages using the preconfigured gh-pages deployment.

## 🔧 Configuration

### Firebase Setup

Update the Firebase configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### GitHub Pages Deployment

The app is configured for GitHub Pages deployment. The homepage URL in `package.json` points to:
`https://pr862.github.io/to-do_list`

## 📁 Project Structure

```
to-do_list/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── TodoItem.js
│   │   └── TodoList.js
│   ├── pages/
│   │   ├── login.js
│   │   └── register.js
│   ├── services/
│   │   ├── notifications.js
│   │   └── todoservices.js
│   ├── animations/
│   │   ├── celebration.json
│   │   └── empty.json
│   ├── App.js
│   ├── App.css
│   ├── firebase.js
│   └── index.js
├── package.json
└── README.md
```

## 🎯 Features in Detail

### User Authentication
- Secure registration and login system
- Password validation and user session management

### Task Management
- Create, read, update, and delete todos
- Mark tasks as complete/incomplete
- Due date assignment and tracking

### Real-time Sync
- All changes sync in real-time across devices
- Offline capability with Firebase

### Visual Enhancements
- Emoji picker for expressing task types
- Lottie animations for user feedback
- Celebration animations on task completion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Firebase](https://firebase.google.com/) - Backend services
- [Lottie](https://airbnb.io/lottie/) - Animation library
- [GitHub Pages](https://pages.github.com/) - Hosting platform

---

**Happy Todo-ing! ✅**
