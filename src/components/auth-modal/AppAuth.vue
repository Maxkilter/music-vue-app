<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" id="modal" :class="hiddenClass">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Your Account</p>
            <div class="modal-close cursor-pointer z-50" @click="isModalVisible = false">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="tab = authModalTabs.LOGIN"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === authModalTabs.LOGIN,
                  'hover:text-blue-600': tab === authModalTabs.REGISTER,
                }"
                >Login</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="tab = authModalTabs.REGISTER"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === authModalTabs.REGISTER,
                  'hover:text-blue-600': tab === authModalTabs.LOGIN,
                }"
                >Register</a
              >
            </li>
          </ul>

          <app-login v-if="tab === authModalTabs.LOGIN" />

          <app-register v-if="tab === authModalTabs.REGISTER" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useModalStore } from "@/stores/auth-modal.js";
import { authModalTabs } from "@/includes/constants.js";
import { defineAsyncComponent } from "vue";

export default {
  name: "AppAuth",
  components: {
    AppLogin: defineAsyncComponent(() => import("./AppLogin.vue")),
    AppRegister: defineAsyncComponent(() => import("./AppRegister.vue")),
  },
  data() {
    return {
      authModalTabs,
      tab: authModalTabs.LOGIN,
    };
  },
  computed: {
    ...mapState(useModalStore, ["hiddenClass"]),
    ...mapWritableState(useModalStore, {
      isModalVisible: "isOpen",
    }),
  },
};
</script>
