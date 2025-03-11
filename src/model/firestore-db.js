// src/model/data/firestore-db.js

const { getFirestore } =  require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const { getAuth } = require("firebase/auth");

const { initializeApp } = require("firebase/app")


const firebaseConfig = {
  apiKey: "AIzaSyARG4XRPl5a5go0ITm8CopCWWLgj6ubSH8",
  authDomain: "bloggle-9f7b4.firebaseapp.com",
  databaseURL: "https://bloggle-9f7b4-default-rtdb.firebaseio.com",
  projectId: "bloggle-9f7b4",
  storageBucket: "bloggle-9f7b4.firebasestorage.app",
  messagingSenderId: "752056474585",
  appId: "1:752056474585:web:5646d0d33bd9a5fd61d7c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
const storage = getStorage(app);
module.exports.fireDB = fireDB; 
module.exports.auth = auth;
module.exports.storage = storage;
