// // src/model/data/firestore-db.js

// require("dotenv").config(); // Load environment variables
// const { getFirestore } = require("firebase/firestore");
// const { getStorage } = require("firebase/storage");
// const { getAuth } = require("firebase/auth");
// const { initializeApp } = require("firebase/app");

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const fireDB = getFirestore(app);
// const auth = getAuth(app);
// const storage = getStorage(app);

// module.exports.fireDB = fireDB;
// module.exports.auth = auth;
// module.exports.storage = storage;
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const fireDB = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { fireDB, auth, storage };
