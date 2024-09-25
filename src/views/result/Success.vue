<template>
  <a-result status="success" title="结果">
    <template #subtitle> Success! 👏 请等待审核</template>
    <template #extra>
      <a-space>
        <a-button type="primary" @click="goBack">返回主页</a-button>
        <a-button type="primary" @click="setScoringRule">设置应用评分</a-button>
        <a-button type="primary" @click="setQuestion">设置题目</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineProps, withDefaults } from "vue";

// 使用 Vue Router 实现跳转
const router = useRouter();

const setScoringRule = () => {
  // 跳转到根路径 "/"
  router.push(`/add/scoring_result/${props.appId}`);
};

const goBack = () => {
  // 跳转到根路径 "/"
  router.push("/");
};

const setQuestion = () => {
  // 跳转到根路径 "/"
  router.push(`/add/question/${props.appId}`);
};

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => "",
});
</script>
