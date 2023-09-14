import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { EmailAuthProvider } from "firebase/auth";
import { getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ,
  appId: process.env.REACT_APP_FIREBASE_APP_ID ,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};



const app = initializeApp(firebaseConfig);
const provider = new EmailAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export {provider, auth, storage}
export default db;