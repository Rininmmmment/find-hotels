import './app.css'

import { createApp } from 'vue'
import App from './App.vue'
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VUE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VUE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VUE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VUE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VUE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VUE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createApp(App).mount('#app');