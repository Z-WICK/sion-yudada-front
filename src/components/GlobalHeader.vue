<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="100px"></a-col>

    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        theme="light"
        :default-selected-keys="['1']"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="titleBar">
            <img class="logo" src="../assets/AgileShot.svg" />
            <div class="title">sionDaLa</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>

    <a-col flex="100px">
      <div v-if="loginUserStore.loginUser.id" class="user-info">
        <img
          class="avatar"
          :src="loginUserStore.loginUser.userAvatar || defaultAvatar"
          alt="avatar"
          @click="goToProfile"
        />
      </div>
      <div v-else>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routers";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";

// 引入默认头像图片
const defaultAvatar = "../assets/default-avatar.png"; // 请将此路径替换为实际的默认头像图片路径

const loginUserStore = useLoginUserStore();

const router = useRouter();

// 顶部菜单点击跳转
const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 头像点击跳转到个人页面函数
const goToProfile = () => {
  // 跳转到 /answer/my 页面
  router.push("/answer/my"); // 使用相对路径，vue-router 会自动处理为绝对路径
};

// 高亮选中的菜单项
const selectKeys = ref(["/"]);

// 路由跳转之后,自动更新被选中的菜单项
router.afterEach((to, from, failure) => {
  selectKeys.value = [to.path];
});

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});
</script>

<style scoped>
#globalHeader {
}

#globalHeader .titleBar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#globalHeader .title {
  color: black;
}

#globalHeader .logo {
  height: 40px;
  margin-right: 10px;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 头像样式 */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

/* 鼠标悬停时头像效果 */
.avatar:hover {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
</style>
