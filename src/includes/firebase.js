import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, collection, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../../config.js";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const storage = getStorage(app);

export const usersCollection = collection(db, "users");
export const songsCollection = collection(db, "songs");
export const commentsCollection = collection(db, "comments");
