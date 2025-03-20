import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    isUserLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const { user } = await auth.createUserWithEmailAndPassword(values.email, values.password);

      if (user) {
        await usersCollection.doc(user.uid).set({
          name: values.name,
          email: values.email,
          age: values.age,
          country: values.country,
        });

        await user.updateProfile({
          displayName: values.name,
        });

        this.isUserLoggedIn = true;
        return user;
      }
    },
    async authenticate({ email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      this.isUserLoggedIn = true;
    },
    async signOut() {
      await auth.signOut();
      this.isUserLoggedIn = false;
    },
  },
});
