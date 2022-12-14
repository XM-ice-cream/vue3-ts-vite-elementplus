import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";
import routes from "./routers";
import { generateRouter } from "@/libs/utils";
import Routers from "./generator-routers";
import { useLocalStorage } from "@/libs/hooks/useLocalStorage";
import { useUserStore } from '@/libs/store/userStore'


enum ELOGINSTATE {
  ISLOGIN = 'Login'
}

const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

const { getLocalStorage } = useLocalStorage();

router.beforeEach(async (to, from, next) => {
  const store = useUserStore();
  const token = getLocalStorage("token") || false;
  const userRouters = store.userRouters;
  const userName = getLocalStorage("userName");

  if (!token && to.name === ELOGINSTATE.ISLOGIN) {
    store.userRouters = [];
    // 未登录 去的是登录页面
    next();
  } else if (!token && to.name !== ELOGINSTATE.ISLOGIN) {
    // 未登录 去的不是登录页面
    next({ name: ELOGINSTATE.ISLOGIN });
  } else if (token && to.name === ELOGINSTATE.ISLOGIN) {
    // 已登录 去的是登录页面
    if (!userName) {
      next();
    } else {
      next({ path: "/" });
    }
  } else if (token && userName && to.name !== ELOGINSTATE.ISLOGIN) {
    // 已登录但是没有用户菜单
    if (userRouters.length === 0) {
      await store.setUserRouters();
      let newRoutes = generateRouter(store.userRouters);
      const layout = routes.find((item: RouteRecordRaw) => item.name == "Layout")!;
      layout.children = [...Routers, ...newRoutes];    
      console.log(layout,Routers);  
      router.addRoute(layout);
      router.replace(to.path);
    }
    store.setNavList(to.fullPath);
    next();
  } else if (!userName) {
    next({ name: ELOGINSTATE.ISLOGIN });
  }
});

export default router;
