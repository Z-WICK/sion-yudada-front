<template>
  <a-button @click="handleClick" status="warning">AI辅助生成</a-button>
  <a-modal
    v-model:visible="visible"
    title="欢迎使用👏AI生成题目"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <a-form :model="form" @submit="handleBeforeOk">
      <a-form-item field="questionNumber" label="题目数量">
        <a-input v-model="form.questionNumber" />
      </a-form-item>
      <a-form-item field="optionNumber" label="选项数量">
        <a-input v-model="form.optionNumber" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { withDefaults, reactive, ref, defineProps } from "vue";
import API from "@/api";
import { useRouter } from "vue-router";
import { aiGenerateQuestionUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";

interface Props {
  appId: string;
  onSuccess?: (result: API.QuestionContentDTO[]) => void;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return "";
  },
});

const router = useRouter();

const visible = ref(false);
const form = reactive({
  optionNum: 3,
  questionNum: 10,
} as API.AiGenerateQuestionRequest);

const handleClick = () => {
  visible.value = true;
};
const handleBeforeOk = async () => {
  if (!props.appId) {
    return;
  }
  const res = await aiGenerateQuestionUsingPost({
    appId: props.appId as any,
    ...form,
  });
  if (res.data.code === 0 && res.data.data.length > 0) {
    if (props.onSuccess) {
      props.onSuccess(res.data.data);
    } else {
      message.success("生成成功");
    }
  } else {
    message.error("生成失败" + res.data.message);
  }
};
const handleCancel = () => {
  visible.value = false;
};
</script>
