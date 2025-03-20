import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/manage-music",
      name: "manage",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/views/ManageView.vue"),
    },
    {
      path: "/manage",
      redirect: {
        name: "manage",
      },
    },
    {
      path: "/:chatchAll(.*)*",
      redirect: { name: "home" },
    },
    {
      name: "song",
      path: "/song/:id",
      component: () => import("@/views/SongView.vue"),
    },
  ],
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next();
  }

  const { isUserLoggedIn } = useUserStore();

  if (isUserLoggedIn) {
    return next();
  } else {
    return next({
      name: "home",
    });
  }
});

export default router;
