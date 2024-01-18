// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq29GwMKteAUiS32LHWNnB3Vsfss40aNQ",
  authDomain: "things-to-do-1f091.firebaseapp.com",
  projectId: "things-to-do-1f091",
  storageBucket: "things-to-do-1f091.appspot.com",
  messagingSenderId: "322499267369",
  appId: "1:322499267369:web:384d8abcc2d20669ab0538",
  measurementId: "G-FMBGQVMZGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const firestore = getFirestore(app)