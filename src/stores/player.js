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
      return state.sound instanceof Howl && state.sound.playing();
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
      if (this.sound instanceof Howl && this.sound.playing()) {
        this.sound.stop();
      }
    },

    progress() {
      if (!(this.sound instanceof Howl)) return;

      const seekTime = this.sound.seek() || 0;
      const duration = this.sound.duration() || 0;

      this.seek = formatTime(seekTime);
      this.duration = formatTime(duration);
      this.playerProgress = duration ? `${(seekTime / duration) * 100}%` : "0%";

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },

    updateSeek(event) {
      if (!(this.sound instanceof Howl && this.sound.playing())) return;

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const percentage = (event.clientX - x) / width;
      const timeInSeconds = this.sound.duration() * percentage;

      this.sound.seek(timeInSeconds);
      this.sound.once("seek", () => {
        requestAnimationFrame(this.progress);
      });
    },

    togglePause() {
      if (!(this.sound instanceof Howl)) return;

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },

    clearPlayerState() {
      this.$reset();
    },
  },
});
