<template>
  <a-result status="error" title="请联系网站管理员">
    <template #subtitle> 🐔 </template>

    <template #extra>
      <a-space>
        <a-button type="primary" @click="goBack">Back</a-button>
        <h3>123@caiXu.com</h3>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// 使用 Vue Router 实现跳转
const router = useRouter();

const goBack = () => {
  // 跳转到根路径 "/"
  router.push("/");
};
</script>
