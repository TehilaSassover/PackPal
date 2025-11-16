import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-OTOhfzCzKqK4tR41tlBjlU4Ma9YrnfQ",
  authDomain: "packpal-fcd91.firebaseapp.com",
  projectId: "packpal-fcd91",
  storageBucket: "packpal-fcd91.firebasestorage.app",
  messagingSenderId: "458289797899",
  appId: "1:458289797899:web:4708002110288f3666200e",
  measurementId: "G-8CWWJ34DLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized"+app.name);

// Initialize Analytics only on client
let analytics;
if (typeof window !== "undefined") {
  // Analytics is only available in the browser
  // import getAnalytics dynamically
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

// Export Authentication & Google Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
