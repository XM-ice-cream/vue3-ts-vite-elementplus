
<!-- 头部 -->
<script setup lang="ts" name="Header">
import { useRouter } from "vue-router";
import { VueDraggableNext } from "vue-draggable-next";
import { computed } from "vue";
import { useUserStore } from "@/libs/store/userStore";
import { useLocalStorage } from '@/libs/hooks/useLocalStorage'
import { fullScreenIcon, circleUrl } from "./base-data";

const router = useRouter();
const store = useUserStore(); 
const { getLocalStorage } = useLocalStorage() 
const current= computed (() => { 
   return router.currentRoute.value.path
}) 

const handleCommand = () => {
    localStorage.clear();
    router.go(0);
};
const routerPush = (path: string) => {
    router.push(path);
};

const closeNav = (path: string) => {
    const currentPath = router.currentRoute.value.fullPath;
    store.navList.forEach((item, index) => {
    if (path === item.path) {
        if (currentPath === item.path) {
        const isLast = index === store.navList.length - 1;
        isLast
            ? router.push(store.navList[index - 1].path)
            : router.push(store.navList[index + 1].path);
        }
        store.closeNav(index);
    }
    });
};

const handleConfigNav = (command: string) => {
    switch (command) {
    case "close-current":
        closeNav(router.currentRoute.value.fullPath);
        break;
    case "close-other":
        store.cloneOtherNav(router.currentRoute.value.fullPath);
        break;
    }
};



const collapseSwitchChange = () => {
    return `width: calc(100% - ${!store.collapse ? '200' : '60'}px);`
}

const darkSwitchChange = () => {
    store.darkSwitch();
}

const divDarkStyle = () => {
    return `transition: all .3s ease-in-out;width: calc(100% - ${!store.collapse ? '200' : '60'}px);background-color:${store.dark ? '#1d1e1f' : '#f9f9f9'}`
}

const scrollToX = (direction: string) => {
    const scrollBox = document.getElementById("scroll-Box")!;
    if (direction === "right") {
    scrollBox.scrollLeft = scrollBox.scrollLeft + scrollBox.offsetWidth;
    } else {
    scrollBox.scrollLeft = scrollBox.scrollLeft - scrollBox.offsetWidth;
    }
};

const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    } else {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    }
};
</script>

<template>
  <header class="m-header" :style="divDarkStyle()">
    <div class="content" >      
      <span @click="scrollToX('left')" class="to-scroll-left">
        <el-icon>
          <ArrowLeft />
        </el-icon>
      </span>
      <div class="tag-list" id="scroll-Box">
        <VueDraggableNext animation="300" :list="store.navList">
          <transition-group>
            <el-tag v-for="element of store.navList" :key="element.path" size="large"
              :effect="element.path == current ? 'dark' : null" :class="`tag-item ${element.path === current ? 'avtive-router' : ''
              }`" :closable="element.path !== '/index/home'" :hit="false" @click="routerPush(element.path)"
              @close="closeNav(element.path)">
              {{ element.title }}
            </el-tag>
          </transition-group>
        </VueDraggableNext>
      </div>
      <span @click="scrollToX('right')" class="to-scroll-right">
        <el-icon>
          <ArrowRight />
        </el-icon>
      </span>
      <el-dropdown trigger="click" @command="handleConfigNav">
        <span :class="`nav-config`">
          <el-icon>
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="current === '/index/home'" command="close-current">关闭当前</el-dropdown-item>
            <el-dropdown-item :disabled="store.navList.length <= 2 && current !== '/index/home'" command="close-other">
              关闭其他</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-switch v-model="store.dark" @change="darkSwitchChange" class="mt-2"
        style="margin-left: 10px;margin-right: 10px" inline-prompt active-icon="Sunny" inactive-icon="Moon" />
      <svg @click="toggleFullScreen" class="fullS-screen" viewBox="0 0 1024 1024" width="22" height="22">
        <path :d="fullScreenIcon" fill="#515151"></path>
      </svg>
      <div class="Avatar">
        <el-dropdown @command="handleCommand">
         <div>【{{getLocalStorage("name")}}】</div> 
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>



<style lang="scss" scoped>
@import "./index.scss";
</style>
