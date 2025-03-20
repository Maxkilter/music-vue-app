import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useUserStore = defineStore("user", {
  state: () => ({
    isUserLoggedIn: false,
  }),
  actions: {
    async register(values) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);

        if (user) {
          await setDoc(doc(usersCollection, user.uid), {
            name: values.name,
            email: values.email,
            age: values.age,
            country: values.country,
          });

          await updateProfile(user, {
            displayName: values.name,
          });

          this.isUserLoggedIn = true;
          return user;
        }
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
    },

    async authenticate({ email, password }) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        this.isUserLoggedIn = true;
      } catch (error) {
        console.error("Error signing in:", error);
        throw error;
      }
    },

    async signOut() {
      try {
        await signOut(auth);
        this.isUserLoggedIn = false;
      } catch (error) {
        console.error("Error signing out:", error);
        throw error;
      }
    },
  },
});
