<template>
  <div
    id="adminQuestionPage"
    :style="{
      padding: '20px',
      background: 'linear-gradient(to bottom right, #f0f4f8, #d9e4ec)',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    }"
  >
    <!-- 搜索表单 -->
    <a-card
      :style="{
        marginBottom: '20px',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      }"
      title="结果搜索"
    >
      <a-form
        :model="formSearchParams"
        :style="{ marginBottom: '20px' }"
        layout="inline"
        @submit="doSearch"
      >
        <a-form-item field="appId" label="应用 id">
          <a-input
            v-model="formSearchParams.appId"
            placeholder="请输入应用 id"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="userId" label="用户 id">
          <a-input
            v-model="formSearchParams.userId"
            placeholder="请输入用户 id"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100px">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据表格 -->
    <a-card
      :style="{
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      }"
    >
      <a-table
        :columns="columns"
        :data="dataList"
        :pagination="{
          showTotal: true,
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total,
        }"
        @page-change="onPageChange"
      >
        <template #questionContent="{ record }">
          <div class="question-content">
            <div
              v-for="question in JSON.parse(record.questionContent)"
              :key="question.title"
              class="question-item"
            >
              <div class="question-title">题目：{{ question.title }}</div>
              <div class="question-options">
                <div
                  v-for="(option, index) in question.options"
                  :key="index"
                  class="question-option"
                >
                  {{ getOptionLabel(index) }}: {{ option }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template #updateTime="{ record }">
          {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button status="danger" @click="doDelete(record)">删除</a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";

const formSearchParams = ref<API.QuestionQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.QuestionQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.Question[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listQuestionByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value,
  };
};

/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 删除
 * @param record
 */
const doDelete = async (record: API.Question) => {
  if (!record.id) {
    return;
  }

  const res = await deleteQuestionUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("删除失败，" + res.data.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});

// 获取选项的标签（A, B, C, D...）
const getOptionLabel = (index: number) => {
  return String.fromCharCode(65 + index);
};

// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "题目内容",
    dataIndex: "questionContent",
    slotName: "questionContent",
  },
  {
    title: "应用 id",
    dataIndex: "appId",
  },
  {
    title: "用户 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
.question-content {
  max-height: 200px; /* 限制最大高度 */
  overflow-y: auto; /* 超出高度时添加滚动条 */
}

.question-item {
  padding: 10px;
  border-bottom: 1px solid #e8e8e8; /* 下划线区分每个问题 */
}

.question-title {
  margin-bottom: 4px;
  font-weight: bold;
}

.question-options {
  margin-left: 20px; /* 缩进选项 */
}

.question-option {
  padding: 2px 0; /* 选项之间增加间距 */
  color: #595959; /* 选项文本颜色 */
}
</style>
