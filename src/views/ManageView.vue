<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <files-upload ref="upload" />
      </div>
      <song-list />
    </div>
  </section>
</template>

<script>
import FilesUpload from "@/components/manage/FilesUpload.vue";
import SongList from "@/components/manage/SongList.vue";
import { mapState } from "pinia";
import { useSongsStore } from "@/stores/songs.js";

export default {
  name: "ManageView",
  components: { SongList: SongList, FilesUpload },
  computed: {
    ...mapState(useSongsStore, ["isDirty"]),
  },

  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      if (!confirm("You have unsaved changes. Do you want to leave?")) {
        return next(false);
      }
    }
    this.$refs.upload.cancelUploads();
    next();
  },
};
</script>
