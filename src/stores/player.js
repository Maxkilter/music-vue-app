import { defineStore } from "pinia";
import { Howl } from "howler";
import { formatTime } from "@/includes/helper.js";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),

  getters: {
    isPlaying(state) {
      if (state.sound.playing) {
        return this.sound.playing();
      }
      return false;
    },
  },

  actions: {
    play(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.currentSong = song;
      this.sound = new Howl({
        src: [song.downloadURL],
        html5: true,
      });
      this.sound.play();
      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },

    stop() {
      if (!this.sound.playing) {
        return;
      }
      return this.sound.stop();
    },

    progress() {
      this.seek = formatTime(this.sound.seek());
      this.duration = formatTime(this.sound.duration());

      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },

    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const percentage = (event.clientX - x) / width;
      const timeInSeconds = this.sound.duration() * percentage;

      this.sound.seek(timeInSeconds);
      this.sound.once("seek", () => {
        requestAnimationFrame(this.progress);
      });
    },

    togglePause() {
      if (!this.sound.playing) {
        return;
      }
      if (this.sound.playing()) {
        return this.sound.pause();
      }
      return this.sound.play();
    },

    clearPlayerState() {
      this.$reset();
    },
  },
});
