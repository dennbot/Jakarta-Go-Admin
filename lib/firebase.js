import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBsk4FqMmkZbNKImBn8Czxpexnc1ml0WyI",
    authDomain: "jakarta-go-authentication.firebaseapp.com",
    projectId: "jakarta-go-authentication",
    storageBucket: "jakarta-go-authentication.firebasestorage.app",
    messagingSenderId: "235330126727",
    appId: "1:235330126727:web:3d4dbdd79f64caeff50922"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export { db };