import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBVVyBoIOY0SG98b3e935R4XTKNgXQyia4",
    authDomain: "mern-5dfe4.firebaseapp.com",
    projectId: "mern-5dfe4",
    storageBucket: "mern-5dfe4.firebasestorage.app",
    messagingSenderId: "449265053696",
    appId: "1:449265053696:web:b76c9a21533b2a151de8e5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, createUserWithEmailAndPassword, signInWithPopup };