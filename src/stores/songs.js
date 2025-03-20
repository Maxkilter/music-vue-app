import { defineStore } from "pinia";
import { auth, songsCollection } from "@/includes/firebase.js";
import { DEFAULT_LIMIT } from "@/includes/constants.js";

export const useSongsStore = defineStore("songs", {
  state: () => ({
    songs: [],
    currentUserSongs: [],
    isDirty: false,
    isPendingRequest: false,
  }),

  actions: {
    async fetchSongs(limit = DEFAULT_LIMIT) {
      if (this.isPendingRequest) {
        return;
      }

      this.isPendingRequest = true;

      try {
        let querySnapshot;

        if (this.songs.length) {
          const lastSong = await songsCollection.doc(this.songs[this.songs.length - 1].id).get();
          querySnapshot = await songsCollection
            .orderBy("modifiedName")
            .startAfter(lastSong)
            .limit(limit)
            .get();
        } else {
          querySnapshot = await songsCollection.orderBy("modifiedName").limit(limit).get();
        }

        querySnapshot.forEach((doc) =>
          this.songs.push({
            id: doc.id,
            ...doc.data(),
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
        const querySnapshot = await songsCollection.where("uid", "==", auth.currentUser.uid).get();
        this.currentUserSongs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (e) {
        console.error("Error fetching user's song list:", e);
        throw e;
      }
    },

    async deleteSong(songId) {
      try {
        await songsCollection.doc(songId).delete();
      } catch (e) {
        console.error("Error deleting song:", e);
        throw e;
      }
    },
    async updateSong(song) {
      try {
        await songsCollection.doc(song.id).update(song);
        this.songs = this.songs.map((s) => (s.id === song.id ? song : s));
        this.updateIsDirty(false);
      } catch (e) {
        console.error("Error updating song:", e);
        throw e;
      }
    },
    async addSong(song) {
      try {
        const docRef = await songsCollection.add(song);
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
        const docSnapshot = await songsCollection.doc(songId).get();
        if (!docSnapshot.exists) {
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
