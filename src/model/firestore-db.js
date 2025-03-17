require("dotenv").config();

const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET, 
});

const fireDB = admin.firestore();
const auth = admin.auth();
const storage = admin.storage(); 


module.exports = { fireDB, auth, storage };

