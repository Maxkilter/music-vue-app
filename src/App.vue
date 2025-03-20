<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <app-auth />
</template>

<script>
import { defineComponent } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import AppAuth from "@/components/auth-modal/AppAuth.vue";
import { mapWritableState } from "pinia";
import { useUserStore } from "@/stores/user";
import { auth } from "./includes/firebase";

export default defineComponent({
  components: { AppAuth, AppHeader },
  computed: {
    ...mapWritableState(useUserStore, ["isUserLoggedIn"]),
  },
  created() {
    if (auth.currentUser) {
      this.isUserLoggedIn = true;
    }
  },
});
</script>

<style>
.fide-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
