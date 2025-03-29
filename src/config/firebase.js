import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBnpXFbysWNkFe-s7LAFZ9HeljNgb1Iq7c",
    authDomain: "mern-user-18104.firebaseapp.com",
    projectId: "mern-user-18104",
    storageBucket: "mern-user-18104.firebasestorage.app",
    messagingSenderId: "889633336642",
    appId: "1:889633336642:web:65538f3d2f45257729ecdb"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);