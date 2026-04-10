// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABuC9T8BsfWiakvCgoauMW8gDN9_VRRlQ",
    authDomain: "task-manager-8e76b.firebaseapp.com",
    projectId: "task-manager-8e76b",
    storageBucket: "task-manager-8e76b.firebasestorage.app",
    messagingSenderId: "614781495634",
    appId: "1:614781495634:web:fb2ca0d9375374d20b328b"
};

const app = initializeApp(firebaseConfig);

export const Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();