// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-4JVuvLsskMy_LP3wfNQEMeX30x9RBGo",
  authDomain: "bioscan-847a4.firebaseapp.com",
  projectId: "bioscan-847a4",
  storageBucket: "bioscan-847a4.firebasestorage.app",
  messagingSenderId: "327596197214",
  appId: "1:327596197214:web:3a5c0fa80391512d8dfbcf",
  measurementId: "G-8Q825EV6SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);