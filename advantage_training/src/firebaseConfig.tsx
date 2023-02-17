import { getFirestore, collection, } from "firebase/firestore";
import { initializeApp } from "firebase/app";

export const firebaseConfig = {
    apiKey: "AIzaSyA31eO4_ACG_lzNZy9nI5O1NSEc9gNmUMc",
    authDomain: "advantagetrainingapp.firebaseapp.com",
    projectId: "advantagetrainingapp",
    storageBucket: "advantagetrainingapp.appspot.com",
    messagingSenderId: "135435325799",
    appId: "1:135435325799:web:c1584d6f3c1564d4045fc2",
    measurementId: "G-YKR6WZF9N4"
  };

 export const app = initializeApp(firebaseConfig);

 export const db = getFirestore(app);

 export const usersRef = collection(db, 'users');
 export const clientsRef = collection(db,'clients')