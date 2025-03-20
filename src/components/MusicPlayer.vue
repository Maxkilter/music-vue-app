<template>
  <div v-if="currentSong.modifiedName" class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <div class="text-center">
      <span class="song-title font-bold">{{ currentSong.modifiedName }}</span> by
      <span class="song-artist">{{ currentSong.displayName || "Author" }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <button type="button" @click.prevent="togglePause">
        <i
          class="fa text-gray-500 text-xl cursor-pointer"
          :class="{ 'fa-pause': isPlaying, 'fa-play': !isPlaying }"
        />
      </button>
      <div class="player-currenttime">{{ seek }}</div>
      <div
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle" />
        </span>
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { usePlayerStore } from "@/stores/player.js";

export default {
  name: "MusicPlayer",
  computed: {
    ...mapState(usePlayerStore, ["isPlaying", "seek", "duration", "playerProgress", "currentSong"]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["togglePause", "updateSeek"]),
  },
};
</script>
