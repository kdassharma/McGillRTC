import { firebase } from '@firebase/app'

import '@firebase/auth'
import '@firebase/auth';
import '@firebase/firestore';

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA_PGjleyhkS-9kwArSYsNPwsso3HiTyxo",
    authDomain: "mcgillrtc-474ff.firebaseapp.com",
    projectId: "mcgillrtc-474ff",
    storageBucket: "mcgillrtc-474ff.appspot.com",
    messagingSenderId: "344514423257",
    appId: "1:344514423257:web:54764f205343f1377c91c8",
    measurementId: "G-R0CD6RXT87"
  };

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

const usersCollection = db.collection('users')

export {
  db,
  auth,
  usersCollection
}
