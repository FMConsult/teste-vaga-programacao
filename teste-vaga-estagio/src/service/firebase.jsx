// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrEvFbS3eyGDXRDGKppJASabviBl82puU",
  authDomain: "fmconsult-daff4.firebaseapp.com",
  projectId: "fmconsult-daff4",
  storageBucket: "fmconsult-daff4.appspot.com",
  messagingSenderId:"604944322421",
  appId: "1:604944322421:web:2bf34396f87fc659498d3c",
  measurementId: "G-M11NWLF40E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
