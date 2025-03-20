import firebase from "firebase/app";
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
