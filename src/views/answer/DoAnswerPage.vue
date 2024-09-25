<template>
  <div id="doAnswerPage" class="container">
    <!-- 答题模块 -->
    <a-card>
      <h1>{{ app.appName }}</h1>
      <p>{{ app.appDesc }}</p>
      <a-divider>题目信息</a-divider>
      <div class="question-info">
        <h2 style="margin-bottom: 16px">
          {{ current }}、{{ currentQuestion?.title }}
        </h2>
        <div v-if="currentQuestion?.description">
          <p>{{ currentQuestion.description }}</p>
        </div>
      </div>
      <a-divider dashed />
      <div>
        <a-radio-group
          direction="vertical"
          v-model="currentAnswer"
          :options="questionOptions"
          @change="doRadioChange"
        />
      </div>
      <div style="margin-top: 24px">
        <a-space size="large">
          <a-button
            type="primary"
            circle
            v-if="current < questionContent.length"
            :disabled="!currentAnswer"
            @click="nextQuestion"
          >
            <IconNext />
            下一题
          </a-button>
          <a-button
            type="primary"
            v-if="current === questionContent.length"
            circle
            :disabled="!currentAnswer"
            @click="doSubmit"
          >
            <IconSubmit />
            查看结果
          </a-button>
          <a-button v-if="current > 1" circle @click="prevQuestion">
            <IconPrevious />
            上一题
          </a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 侧边栏 -->
    <div class="sidebar">
      <h3>当前进度</h3>
      <ProgressDisplay
        :current-progress="current"
        :total-questions="questionContent.length"
      />
      <h3>剩余时间</h3>
      <p>{{ remainingTime }}</p>
      <h3>答题技巧</h3>
      <ul>
        <li>先易后难，合理分配时间</li>
        <li>仔细审题，避免误解</li>
        <li>放轻松哈!</li>
      </ul>
    </div>

    <!-- 页脚 -->
    <footer>
      <a-divider />
      <p class="adaptive-text">
        &copy; 2024 SionAI 答题平台 | 联系我们: support@Sionai.com
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  reactive,
  ref,
  watchEffect,
  withDefaults,
} from "vue";
import API from "@/api";
import { useRouter } from "vue-router";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import { getAppVoByIdUsingGet } from "@/api/appController";
import { addUserAnswerUsingPost } from "@/api/userAnswerController";
import ProgressDisplay from "./components/ProgressDisplay.vue";
import {
  IconNext,
  IconSubmit,
  IconPrevious,
} from "@arco-design/web-vue/es/icon";

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => "",
});

const router = useRouter();

const app = ref<API.AppVO>({});
const questionContent = ref<API.QuestionContentDTO[]>([]);
const current = ref(1);
const currentQuestion = ref<API.QuestionContentDTO>({});
const questionOptions = computed(() => {
  return currentQuestion.value?.options
    ? currentQuestion.value.options.map((option) => {
        return {
          label: `${option.key}. ${option.value}`,
          value: option.key,
        };
      })
    : [];
});
const currentAnswer = ref<string>();
const answerList = reactive<string[]>([]);
const remainingTime = ref("30:00"); // Assuming static value for demo; you can add countdown logic here

const loadData = async () => {
  if (!props.appId) return;
  let res: any = await getAppVoByIdUsingGet({ id: props.appId as any });
  if (res.data.code === 0) {
    app.value = res.data.data as any;
  } else {
    message.error("获取应用失败，" + res.data.message);
  }
  res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    questionContent.value = res.data.data.records[0].questionContent;
  } else {
    message.error("获取题目失败，" + res.data.message);
  }
};

watchEffect(() => {
  loadData();
});

watchEffect(() => {
  currentQuestion.value = questionContent.value[current.value - 1];
  currentAnswer.value = answerList[current.value - 1];
});

const doRadioChange = (value: string) => {
  answerList[current.value - 1] = value;
  message.success("已选择：" + value);
};

const nextQuestion = () => {
  if (current.value < questionContent.value.length) {
    current.value++;
  }
};

const prevQuestion = () => {
  if (current.value > 1) {
    current.value--;
  }
};

const doSubmit = async () => {
  if (!props.appId || !answerList) return;
  const res = await addUserAnswerUsingPost({
    appId: props.appId as any,
    choices: answerList,
  });
  if (res.data.code === 0 && res.data.data) {
    router.push(`/answer/result/${res.data.data}`);
  } else {
    message.error("提交答案失败，" + res.data.message);
  }
};
</script>

<style scoped>
#doAnswerPage {
  display: flex;
  justify-content: space-between;
  margin: 20px;
  padding: 20px;
  color: #333;
  background: url("https://s2.loli.net/2024/09/19/LnyOtFzaSHC5pqQ.jpg")
    no-repeat center center;
  background-size: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.question-info {
  margin-bottom: 20px;
}

.sidebar {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

footer {
  margin-top: 20px;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
}

a-divider {
  margin: 20px 0;
}

.adaptive-text {
  color: white; : difference; /* 或者使用 exclusion
  mix-blend-mode: difference; /* 在浅色背景上会显示为白色，在深色背景上会显示为黑色 */
}

a-button {
  margin: 0 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
