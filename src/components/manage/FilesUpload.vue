<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <label
        for="fileInput"
        class="float-right text-green-400 text-2xl cursor-pointer hover:text-green-500"
      >
        <i class="fas fa-upload" />
      </label>
      <input id="fileInput" type="file" multiple class="hidden" @change="upload($event)" />
    </div>

    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragenter.prevent.stop="isDragOver = true"
        @dragover.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div class="font-bold text-sm" :class="upload.textClass">
          <i class="mr-1" :class="upload.icon" />{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{
              width: `${upload.currentProgress}%`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useSongsStore } from "@/stores/songs.js";
import { auth, storage } from "@/includes/firebase.js";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";

export default {
  name: "FilesUpload",
  data() {
    return {
      isDragOver: false,
      uploads: [],
    };
  },
  methods: {
    ...mapActions(useSongsStore, ["addSong", "fetchCurrentUserSongs"]),

    upload($event) {
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

      files.forEach((file) => {
        if (!file.type.match(/^audio\//)) {
          console.error("Invalid file type");
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            currentProgress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            textClass: "text-red-400",
          });
          return;
        }

        const songRef = storageRef(storage, `songs/${file.name}`);
        const task = uploadBytesResumable(songRef, file);

        const uploadIndex =
          this.uploads.push({
            task,
            currentProgress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textClass: "",
          }) - 1;

        task.on(
          "state_changed",
          (snapshot) => {
            this.uploads[uploadIndex].currentProgress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            this.uploads[uploadIndex].variant = "bg-red-400";
            this.uploads[uploadIndex].icon = "fas fa-times";
            this.uploads[uploadIndex].textClass = "text-red-400";
            console.error(error.message);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originalName: file.name,
              modifiedName: file.name,
              genre: "",
              commentCount: 0,
            };

            song.downloadURL = await getDownloadURL(task.snapshot.ref);

            try {
              await this.addSong(song);
              await this.fetchCurrentUserSongs();
              this.uploads[uploadIndex].variant = "bg-green-400";
              this.uploads[uploadIndex].icon = "fas fa-check";
              this.uploads[uploadIndex].textClass = "text-green-400";
            } catch (e) {
              console.error(e);
              this.uploads[uploadIndex].variant = "bg-red-400";
              this.uploads[uploadIndex].icon = "fas fa-times";
              this.uploads[uploadIndex].textClass = "text-red-400";
            }
          },
        );
      });
      this.isDragOver = false;
    },

    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
};
</script>
