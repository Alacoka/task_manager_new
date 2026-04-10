// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABuC9T8BsfWiakvCgoauMW8gDN9_VRRlQ",
    authDomain: "task-manager-8e76b.firebaseapp.com",
    projectId: "task-manager-8e76b",
    storageBucket: "task-manager-8e76b.firebasestorage.app",
    messagingSenderId: "614781495634",
    appId: "1:614781495634:web:fb2ca0d9375374d20b328b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const Auth = getAuth(app);

export { app, Auth };