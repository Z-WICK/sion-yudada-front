<template>
  <div id="addQuestionPage" class="container">
    <!-- 左右两侧部分 -->
    <div class="content-section">
      <!-- 左侧表单部分 -->
      <div class="form-section">
        <a-form
          :model="questionContent"
          :style="{ width: '100%' }"
          label-align="left"
          auto-label-width
          @submit="handleSubmit"
        >
          <!-- 遍历每道题目 -->
          <div
            v-for="(question, questionIndex) in questionContent"
            :key="questionIndex"
            class="question-item"
          >
            <div class="question-header">
              <h3>题目 {{ questionIndex + 1 }}</h3>
              <a-space>
                <a-button
                  size="small"
                  @click="addQuestion(questionContent.length)"
                >
                  添加题目
                </a-button>

                <!--AI生成题目的弹窗-->

                <QuestionGeneralByAiModal
                  :appId="appId"
                  :onSuccess="onAiGenerateSuccess"
                />

                <a-button
                  size="small"
                  status="danger"
                  @click="deleteQuestion(questionIndex)"
                >
                  删除题目
                </a-button>
              </a-space>
            </div>

            <!-- 题目标题 -->
            <a-form-item label="题目标题">
              <a-input v-model="question.title" placeholder="请输入标题" />
            </a-form-item>

            <!-- 题目选项部分 -->
            <div class="options-section">
              <h4>选项列表</h4>
              <a-button
                size="small"
                type="primary"
                @click="addQuestionOption(question, question.options.length)"
              >
                添加选项
              </a-button>
              <div
                v-for="(option, optionIndex) in question.options"
                :key="optionIndex"
                class="option-item"
              >
                <a-space size="small" direction="vertical">
                  <a-space size="middle" align="center">
                    <a-form-item label="选项 key" class="input-item">
                      <a-input
                        v-model="option.key"
                        placeholder="请输入选项 key"
                        class="input-box"
                      />
                    </a-form-item>
                    <a-form-item label="选项值" class="input-item">
                      <a-input
                        v-model="option.value"
                        placeholder="请输入选项值"
                        class="input-box"
                      />
                    </a-form-item>
                    <a-form-item label="选项得分" class="input-item">
                      <a-input-number
                        v-model="option.score"
                        placeholder="请输入选项得分"
                        class="input-box"
                      />
                    </a-form-item>
                  </a-space>
                  <a-space size="small">
                    <a-button
                      size="mini"
                      @click="addQuestionOption(question, optionIndex + 1)"
                    >
                      添加选项
                    </a-button>
                    <a-button
                      size="mini"
                      status="danger"
                      @click="deleteQuestionOption(question, optionIndex)"
                    >
                      删除选项
                    </a-button>
                  </a-space>
                </a-space>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <a-form-item class="submit-button">
            <a-button type="primary" html-type="submit" style="width: 100px">
              提交
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 右侧实时渲染部分 -->
      <div class="render-section">
        <h3>题目预览</h3>
        <QuestionRendering :questionContent="questionContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, nextTick, ref, watchEffect, withDefaults } from "vue";
import { useRouter } from "vue-router";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import QuestionRendering from "@/views/add/components/QuestionRendering.vue";
import QuestionGeneralByAiModal from "@/views/add/components/QuestionGeneralByAiModal.vue";
import API from "@/api";

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});

const router = useRouter();
const questionContent = ref<API.QuestionContentDTO[]>([]);

const addQuestion = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: "",
    content: "",
    options: [],
  });

  nextTick(() => {
    const lastQuestionElement = document.querySelector(`#question-${index}`);
    lastQuestionElement?.scrollIntoView({ behavior: "smooth" });
  });
};

const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};

const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 0, {
    key: "",
    value: "",
    score: 0,
  });
};

const deleteQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 1);
};

const oldQuestion = ref<API.QuestionVO>();

const loadData = async () => {
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    oldQuestion.value = res.data.data?.records[0];
    if (oldQuestion.value) {
      questionContent.value = oldQuestion.value.questionContent ?? [];
    }
  } else {
    message.error("获取数据失败，" + res.data.message);
  }

  // 检查是否存在题目，如果没有则添加一个空的题目
  if (questionContent.value.length === 0) {
    addQuestion(0);
  }
};

watchEffect(() => {
  loadData();
});

const handleSubmit = async () => {
  if (!props.appId || !questionContent.value) {
    return;
  }
  let res: any;
  if (oldQuestion.value?.id) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value.id,
      questionContent: questionContent.value,
    });
  } else {
    res = await addQuestionUsingPost({
      appId: props.appId as any,
      questionContent: questionContent.value,
    });
  }
  if (res.data.code === 0) {
    message.success("正在提交中,稍等片刻");
    setTimeout(() => {
      router.push(`/result/success/${props.appId ?? res.data.data}`);
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};

//AI 生成完题目之后展现
const onAiGenerateSuccess = (result: API.QuestionContentDTO[]) => {
  questionContent.value = [...questionContent.value, ...result];
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.content-section {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.form-section {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.render-section {
  flex: 1;
  max-width: 400px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 4px;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.question-content {
  margin-bottom: 10px;
}

.options-section {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.option-item {
  margin-top: 10px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #eee;
  border-radius: 4px;
}

.input-item {
  width: 100%;
}

.input-box {
  width: 100%;
}

.submit-button {
  display: flex;
  justify-content: center;
}
</style>
