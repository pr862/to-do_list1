import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCUSm3IfjTDKj_u6Nj7pGWSvLjoxI8-MpI",
  authDomain: "todo-e964c.firebaseapp.com",
  projectId: "todo-e964c",
  storageBucket: "todo-e964c.firebasestorage.app",
  messagingSenderId: "968829597132",
  appId: "1:968829597132:web:b804a22a3d1acae161d969",
  measurementId: "G-MT8PVEJRBP"
};

const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app); // optional

export { db, auth, provider, analytics };