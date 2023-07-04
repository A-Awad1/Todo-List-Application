import { createRouter, createWebHistory } from "vue-router";
import i18n from "../i18n";
import App from "../App";
import HomeView from "../views/HomeView";

const routes = [
  {
    path: "/:catchAll(.*)",
    redirect: `/${i18n.global.locale}`,
  },
  {
    path: "/",
    redirect: `/${i18n.global.locale}`,
  },
  {
    path: "/:lang",
    component: App,
    children: [
      {
        path: "",
        component: HomeView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  let allLocales = i18n.global.availableLocales.map((e) => e.toLowerCase());
  let routerLang = to.params.lang.toLowerCase();
  if (allLocales.includes(routerLang)) {
    localStorage.lang = routerLang;
  } else {
    router.push({
      params: {
        lang: localStorage.lang || "en",
      },
    });
  }
  i18n.global.locale = localStorage.lang || "en";
  next();
});

export default router;
