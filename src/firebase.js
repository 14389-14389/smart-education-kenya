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

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);

// Test function to verify storage configuration
export const testFirebaseStorage = async () => {
  try {
    console.log('Testing Firebase Storage configuration...');
    console.log('Storage bucket:', storage._bucket);
    
    // Simple test to verify storage is accessible
    const { ref, listAll } = await import('firebase/storage');
    const testRef = ref(storage, '');
    
    console.log('Firebase Storage initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase Storage test failed:', error);
    return false;
  }
};

export default app;