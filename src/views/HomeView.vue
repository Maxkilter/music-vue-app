<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(/img/header.png)"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="/img/introduction-music.png"
        alt="introduction-music"
      />
    </section>
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon.right="'headphones-alt'"
        >
          <span class="card-title">Songs</span>
        </div>
        <ol id="playlist">
          <li
            v-for="song in songs"
            :key="song.id"
            class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
          >
            <div>
              <router-link
                :to="{ name: 'song', params: { id: song.id } }"
                class="font-bold block text-gray-600"
                >{{ song.modifiedName }}</router-link
              >
              <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
            </div>

            <div class="text-gray-600 text-lg">
              <router-link
                custom
                :to="{ name: 'song', params: { id: song.id }, hash: '#comments' }"
                v-slot="{ navigate }"
              >
                <span
                  class="comments"
                  @click="navigate"
                  v-icon-secondary="{ icon: 'comments', color: 'black' }"
                />
                {{ song.commentCount }}
              </router-link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </main>
</template>
<script>
import { mapActions, mapState } from "pinia";
import { useSongsStore } from "@/stores/songs.js";
import IconSecondary from "@/directives/icon-secondary";

export default {
  name: "HomeView",
  directives: {
    "icon-secondary": IconSecondary,
  },
  computed: {
    ...mapState(useSongsStore, ["songs"]),
  },
  methods: {
    ...mapActions(useSongsStore, ["fetchSongs"]),

    handleScroll() {
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;

      if (bottomOfWindow) {
        this.fetchSongs();
      }
    },
  },
  created() {
    this.fetchSongs();

    window.addEventListener("scroll", () => {
      this.handleScroll();
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", () => {
      this.handleScroll();
    });
  },
};
</script>
