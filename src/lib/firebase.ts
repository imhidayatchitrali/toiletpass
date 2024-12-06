import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAuIUfWu_oxQVUTAKTOaKuHFbK6jQIdv3k",
  authDomain: "toilettepass.firebaseapp.com",
  projectId: "toilettepass",
  storageBucket: "toilettepass.appspot.com",
  messagingSenderId: "995732343949",
  appId: "1:995732343949:web:98929892fd661d511be6c4",
  measurementId: "G-P5Q5P0CV32"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'europe-west1');
// const functions = getFunctions(app, 'us-central1');
const auth = getAuth(app);
const storage = getStorage(app);

// En développement, connectez-vous à l'émulateur
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { app, analytics, db, functions, auth, storage };