// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdmIZ05aEqyUojCLX-kLdpM6-b4w80GLg",
  authDomain: "admindashboardapp-9ea24.firebaseapp.com",
  projectId: "admindashboardapp-9ea24",
  storageBucket: "admindashboardapp-9ea24.firebasestorage.app",
  messagingSenderId: "632414441615",
  appId: "1:632414441615:web:e5a91baa36f2933d75e0fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
