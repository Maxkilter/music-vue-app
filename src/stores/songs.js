import { defineStore } from "pinia";
import { auth, songsCollection } from "@/includes/firebase.js";
import { DEFAULT_LIMIT } from "@/includes/constants.js";
import {
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit as queryLimit,
  where,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export const useSongsStore = defineStore("songs", {
  state: () => ({
    songs: [],
    currentUserSongs: [],
    isDirty: false,
    isPendingRequest: false,
  }),

  actions: {
    async fetchSongs(limit = DEFAULT_LIMIT) {
      if (this.isPendingRequest) return;
      this.isPendingRequest = true;
      try {
        let q;
        if (this.songs.length) {
          // Get the last document snapshot from the current songs array
          const lastSongId = this.songs[this.songs.length - 1].id;
          const lastSongDocRef = doc(songsCollection, lastSongId);
          const lastSongDoc = await getDoc(lastSongDocRef);
          q = query(
            songsCollection,
            orderBy("modifiedName"),
            startAfter(lastSongDoc),
            queryLimit(limit),
          );
        } else {
          q = query(songsCollection, orderBy("modifiedName"), queryLimit(limit));
        }
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnapshot) =>
          this.songs.push({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          }),
        );
      } catch (e) {
        console.error("Error fetching songs:", e);
        throw e;
      } finally {
        this.isPendingRequest = false;
      }
    },

    async fetchCurrentUserSongs() {
      try {
        const q = query(
          songsCollection,
          where("uid", "==", auth.currentUser.uid),
          orderBy("modifiedName"),
        );
        const querySnapshot = await getDocs(q);
        this.currentUserSongs = querySnapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
      } catch (e) {
        console.error("Error fetching user's song list:", e);
        throw e;
      }
    },

    async deleteSong(songId) {
      try {
        const songDocRef = doc(songsCollection, songId);
        await deleteDoc(songDocRef);
      } catch (e) {
        console.error("Error deleting song:", e);
        throw e;
      }
    },

    async updateSong(song) {
      try {
        const songDocRef = doc(songsCollection, song.id);
        await updateDoc(songDocRef, song);
        this.songs = this.songs.map((s) => (s.id === song.id ? song : s));
        this.updateIsDirty(false);
      } catch (e) {
        console.error("Error updating song:", e);
        throw e;
      }
    },

    async addSong(song) {
      try {
        const docRef = await addDoc(songsCollection, song);
        this.songs.push({
          id: docRef.id,
          ...song,
        });
      } catch (e) {
        console.error("Error adding song:", e);
        throw e;
      }
    },

    async fetchSong(songId) {
      try {
        const songDocRef = doc(songsCollection, songId);
        const docSnapshot = await getDoc(songDocRef);
        if (!docSnapshot.exists()) {
          throw new Error("notExists");
        }
        return { id: songId, ...docSnapshot.data() };
      } catch (e) {
        console.error("Error fetching song:", e);
        throw e;
      }
    },

    updateIsDirty(value) {
      this.isDirty = value;
    },
  },
});
