<template>
  <a-list-item
    class="list-demo-item"
    action-layout="vertical"
    @click="doCardClick"
  >
    <template #actions>
      <span @click.stop="onShareClick"><IconShareInternal /> 分享</span>
    </template>
    <template #extra>
      <div class="image-area">
        <img :alt="app.appName" :src="app.appIcon" />
      </div>
    </template>
    <a-list-item-meta :title="app.appName" :description="app.appDesc">
      <template #avatar>
        <a-avatar shape="square" :size="24" :image-url="app.user?.userAvatar" />
      </template>
    </a-list-item-meta>

    <!-- 详情弹出框，加载 AppDetailPage 组件 -->
    <a-modal v-model:visible="isModalVisible" width="720" title="应用详情">
      <!-- 引入 AppDetailPage 组件 -->
      <AppDetailPage :id="app.id" />

      <!-- 自定义底部按钮 -->
      <template #footer>
        <!-- 开始答题按钮替换到确定按钮位置 -->
        <a-button type="primary" @click="handleStartQuiz"> 开始答题</a-button>
        <!-- 分享应用按钮替换到取消按钮位置 -->
        <a-button @click="onShareClick"> 分享应用</a-button>
      </template>
    </a-modal>
  </a-list-item>
  <share-modal :link="shareLink" title="应用分享" ref="shareModalRef" />
</template>

<script setup lang="ts">
import { IconShareInternal } from "@arco-design/web-vue/es/icon";
import { defineProps, withDefaults, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import AppDetailPage from "../views/app/AppDetailPage.vue"; // 引入组件
import { useRouter } from "vue-router"; // 使用路由
import API from "../api";
import ShareModal from "../components/ShareModal.vue";

interface Props {
  app: API.AppVO;
}

const props = withDefaults(defineProps<Props>(), {
  app: () => ({}),
});

// 控制对话框显示
const isModalVisible = ref(false);
// 引入分享对话框组件
const shareModalRef = ref();

//分享链接
const shareLink = `${window.location.protocol}//${window.location.host}/app/detail/${props.app.id}`;

// 点击卡片显示对话框
const doCardClick = () => {
  isModalVisible.value = true;
};

// 分享按钮点击事件
const onShareClick = (event: Event) => {
  event?.stopPropagation(); // 阻止事件冒泡
  if (shareModalRef.value) {
    shareModalRef.value.openModal();
  }
};

// 点击开始答题按钮跳转
const router = useRouter();
const handleStartQuiz = () => {
  isModalVisible.value = false; // 关闭对话框
  router.push(`/answer/do/${props.app.id}`); // 跳转到答题页面
};
</script>

<style scoped>
.list-demo-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
  cursor: pointer;
}

.image-area {
  width: 183px;
  height: 119px;
  overflow: hidden;
  border-radius: 2px;
}

.image-area img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.list-demo-item-meta {
  flex-grow: 1;
}
</style>
