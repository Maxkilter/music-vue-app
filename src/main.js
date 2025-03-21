import "./assets/base.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { VeeValidatePlugin } from "@/includes/validation.js";
import { auth } from "@/includes/firebase.js";
import Icon from "@/directives/icon";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin, {});
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
