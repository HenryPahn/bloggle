// src/model/firestore-db.js

// const admin = require("firebase-admin");
// var serviceAccount = require("../../firebase/permission.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "bloggle-9f7b4.firebasestorage.app",
// });

// const fireDB = admin.firestore();
// const auth = admin.auth();
// const storage = admin.storage().bucket("bloggle-9f7b4.firebasestorage.app"); 

// module.exports.fireDB = fireDB;
// module.exports.auth = auth;
// module.exports.storage = storage;


const admin = require("firebase-admin");
const serviceAccount = require("../../firebase/permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bloggle-9f7b4-default-rtdb.firebaseio.com",
  storageBucket: "gs://bloggle-9f7b4.firebasestorage.app", 
});

const fireDB = admin.firestore();
const auth = admin.auth();
const storage = admin.storage(); 


module.exports = { fireDB, auth, storage };
