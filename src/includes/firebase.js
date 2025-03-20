import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const storage = firebase.storage();
export const auth = firebase.auth();
export const usersCollection = db.collection("users");
export const songsCollection = db.collection("songs");
export const commentsCollection = db.collection("comments");
