<template>
  <div class="col-span-2">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">My Songs</span>
        <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
      </div>
      <div class="p-6">
        <div
          v-for="song in currentUserSongs"
          :key="song.id"
          class="border border-gray-200 p-3 mb-4 rounded"
        >
          <div>
            <h4 v-if="editSongId !== song.id" class="inline-block text-2xl font-bold">
              {{ song.modifiedName }}
            </h4>
            <template v-if="editSongId !== song.id">
              <button
                class="ml-1 py-1 w-8 h-8 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="onDeleteSong(song.id)"
              >
                <i class="fa fa-times" />
              </button>
              <button
                class="ml-1 py-1 w-8 h-8 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="onEditSong(song.id)"
              >
                <i class="fa fa-pencil-alt" />
              </button>
            </template>
            <edit-song :song="song" :cancelEditSong v-if="editSongId === song.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditSong from "@/components/manage/EditSong.vue";
import { mapActions, mapState } from "pinia";
import { useSongsStore } from "@/stores/songs.js";

export default {
  name: "SongList",
  components: { EditSong },
  data() {
    return {
      editSongId: null,
    };
  },
  computed: {
    ...mapState(useSongsStore, ["currentUserSongs"]),
  },
  methods: {
    ...mapActions(useSongsStore, ["fetchCurrentUserSongs", "deleteSong"]),

    onEditSong(songId) {
      this.editSongId = songId;
    },

    onDeleteSong(id) {
      if (!confirm("Are you sure you want to delete this song?")) {
        return;
      }
      this.deleteSong(id);
      this.fetchCurrentUserSongs();
    },

    cancelEditSong() {
      this.editSongId = null;
    },
  },
  created() {
    this.fetchCurrentUserSongs();
  },
};
</script>
