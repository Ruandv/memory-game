import { initializeApp } from 'firebase/app';
import { getFirestore  } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
    apiKey: "",
    authDomain: "memorygame-9dbaa.firebaseapp.com",
    projectId: "memorygame-9dbaa",
    storageBucket: "memorygame-9dbaa.appspot.com",
    messagingSenderId: "765885426116",
    appId: "1:765885426116:web:0a4a720fce57e71a329c91",
    measurementId: "G-HKSG6X59F2"
};

const fbApp = initializeApp(config);
const db = getFirestore(fbApp)

export default db;