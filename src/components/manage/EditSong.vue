<template>
  <div>
    <div v-if="showAlert" class="text-white text-center font-bold p-4 mb-4" :class="alertVariant">
      {{ alertMessage }}
    </div>
    <vee-form :validation-schema="schema" :initial-values="song" @submit="onEditSong">
      <div class="mb-3">
        <label class="inline-block mb-2">Song Title</label>
        <vee-field
          name="modifiedName"
          type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Song Title"
          @input="updateIsDirty(true)"
        />
        <ErrorMessage name="modifiedName" class="text-red-600" />
      </div>
      <div class="mb-3">
        <label class="inline-block mb-2">Genre</label>
        <vee-field
          name="genre"
          type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Genre"
          @input="updateIsDirty(true)"
        />
        <ErrorMessage name="genre" class="text-red-600" />
      </div>
      <button
        type="submit"
        class="py-1.5 px-3 rounded text-white bg-green-600 mr-1"
        :disabled="inSubmission"
      >
        Submit
      </button>
      <button
        type="button"
        class="py-1.5 px-3 rounded text-white bg-gray-600"
        :disabled="inSubmission"
        @click.prevent="cancelEditSong"
      >
        Go Back
      </button>
    </vee-form>
  </div>
</template>
<script>
import { ErrorMessage } from "vee-validate";
import { mapActions } from "pinia";
import { useSongsStore } from "@/stores/songs.js";

export default {
  name: "EditSong",
  components: { ErrorMessage },
  props: ["song", "cancelEditSong"],
  data() {
    return {
      schema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Updating song information...",
    };
  },
  methods: {
    ...mapActions(useSongsStore, ["updateSong", "updateIsDirty", "fetchCurrentUserSongs"]),

    onEditSong(values) {
      this.inSubmission = true;
      this.showAlert = true;

      try {
        this.updateSong(values);
        this.fetchCurrentUserSongs();
        this.inSubmission = false;
        this.alertVariant = "bg-green-500";
        this.alertMessage = "Successfully updated song information.";
        setTimeout(() => this.cancelEditSong(), 1000);
      } catch (e) {
        this.inSubmission = false;
        this.showAlert = true;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Error updating song information.";
        console.error("Error updating song information:", e);
      }
    },
  },
};
</script>
