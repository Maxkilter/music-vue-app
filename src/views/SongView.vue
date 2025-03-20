<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/img/song-header.png)"
      />
      <div class="container mx-auto flex items-center">
        <button
          @click.prevent="isPlaying ? stop() : play(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none cursor-pointer"
        >
          <i class="fas" :class="{ 'fa-stop': isPlaying, 'fa-play': !isPlaying }" />
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, "currency") }}</div>
        </div>
      </div>
    </section>
    <section class="container mx-auto mt-6">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{
            $t("song.commentCount", { count: song.commentCount })
          }}</span>
          <div class="flex justify-between">
            <select
              v-model="sort"
              class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            >
              <option value="byLatest">Latest</option>
              <option value="byOldest">Oldest</option>
            </select>
            <i class="fa fa-comments float-right text-green-400 text-2xl" />
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="commentInSubmission"
            class="text-white text-center font-bold p-4 mb-4"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <vee-form
            v-if="isUserLoggedIn"
            @submit="onSubmit"
            :validation-schema="{ comment: 'required|min:3' }"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            />
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block ml-auto mr-auto cursor-pointer w-2/5"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </vee-form>
        </div>
      </div>
    </section>
    <ul class="container mx-auto" id="comments">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.id"
      >
        <div class="mb-5">
          <div class="font-bold">{{ comment.userName }}</div>
          <time>{{ comment.createdAt }}</time>
        </div>
        <p>{{ comment.content }}</p>
      </li>
    </ul>
    <music-player />
  </main>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSongsStore } from "@/stores/songs.js";
import { ErrorMessage } from "vee-validate";
import { auth, commentsCollection } from "@/includes/firebase.js";
import { useUserStore } from "@/stores/user.js";
import { usePlayerStore } from "@/stores/player.js";
import MusicPlayer from "@/components/MusicPlayer.vue";
import { addDoc, query, where, getDocs } from "firebase/firestore";

export default {
  name: "SongView",
  components: { MusicPlayer, ErrorMessage },
  data() {
    return {
      song: {},
      comments: [],
      commentInSubmission: false,
      commentAlertVariant: "",
      commentAlertMessage: "",
      sort: "byLatest",
    };
  },
  computed: {
    ...mapState(useUserStore, ["isUserLoggedIn"]),
    ...mapState(usePlayerStore, ["isPlaying"]),

    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sort === "byLatest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    },
  },
  methods: {
    ...mapActions(usePlayerStore, ["play", "stop", "clearPlayerState"]),
    ...mapActions(useSongsStore, ["fetchSong", "updateSong"]),

    async onSubmit(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentAlertVariant = "bg-blue-500";
      this.commentAlertMessage = "Please wait..., your comment is being submitted";

      try {
        await addDoc(commentsCollection, {
          content: values.comment,
          songId: this.$route.params.id,
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          createdAt: new Date().toString(),
        });
        this.commentAlertVariant = "bg-green-500";
        this.commentAlertMessage = "Your comment has been submitted";

        this.song.commentCount = (this.song.commentCount || 0) + 1;
        await this.updateSong(this.song);

        await this.getComments();
        resetForm();
      } catch (e) {
        console.error(e.message);
        this.commentAlertVariant = "bg-red-500";
        this.commentAlertMessage = "An error occurred while submitting your comment";
      } finally {
        setTimeout(() => (this.commentInSubmission = false), 1000);
      }
    },

    async getComments() {
      if (!this.song) {
        return;
      }
      try {
        const q = query(commentsCollection, where("songId", "==", this.$route.params.id));
        const querySnapshot = await getDocs(q);
        this.comments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (e) {
        console.error(e.message);
        throw e;
      }
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({ query: { sort: newVal } });
    },
  },
  async created() {
    try {
      this.song = await this.fetchSong(this.$route.params.id);
      const sort = this.$route.query.sort;
      this.sort = sort === "byOldest" || sort === "byLatest" ? sort : "byLatest";
      await this.getComments();
    } catch (e) {
      if (e.message === "notExists") {
        return this.$router.push({ name: "home" });
      }
    }
  },
  beforeUnmount() {
    this.clearPlayerState();
  },
};
</script>
