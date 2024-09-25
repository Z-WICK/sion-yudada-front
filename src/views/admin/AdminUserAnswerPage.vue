<template>
  <div
    id="userAnswerManagementPage"
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
      <a-form :model="formSearchParams" layout="inline" @submit="doSearch">
        <a-form-item field="appId" label="应用 ID">
          <a-input
            allow-clear
            v-model="formSearchParams.appId"
            placeholder="请输入应用 ID"
          />
        </a-form-item>
        <a-form-item field="userId" label="用户 ID">
          <a-input
            allow-clear
            v-model="formSearchParams.userId"
            placeholder="请输入用户 ID"
          />
        </a-form-item>
        <a-form-item field="resultName" label="结果名称">
          <a-input
            allow-clear
            v-model="formSearchParams.resultName"
            placeholder="请输入结果名称"
          />
        </a-form-item>
        <a-form-item field="resultDesc" label="结果描述">
          <a-input
            allow-clear
            v-model="formSearchParams.resultDesc"
            placeholder="请输入结果描述"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :style="{ width: '120px', borderRadius: '8px' }"
          >
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
        :row-class-name="
          (record) => (record.resultScore > 80 ? 'highlight-row' : '')
        "
      >
        <!-- 图片区添加 hover 放大效果 -->
        <template #resultPicture="{ record }">
          <a-image
            width="64"
            :src="record.resultPicture"
            style="border-radius: 8px; transition: transform 0.3s"
            @mouseover="
              (event) => (event.target.style.transform = 'scale(1.1)')
            "
            @mouseleave="(event) => (event.target.style.transform = 'scale(1)')"
          />
        </template>
        <template #appType="{ record }">
          {{ APP_TYPE_MAP[record.appType] }}
        </template>
        <template #scoringStrategy="{ record }">
          {{ APP_SCORING_STRATEGY_MAP[record.scoringStrategy] }}
        </template>
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template #updateTime="{ record }">
          {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button
              status="danger"
              @click="doDelete(record)"

            >
              删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteUserAnswerUsingPost,
  listUserAnswerByPageUsingPost,
} from "@/api/userAnswerController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

const formSearchParams = ref<API.UserAnswerQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.UserAnswerQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.UserAnswer[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listUserAnswerByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.UserAnswer) => {
  if (!record.id) {
    return;
  }

  const res = await deleteUserAnswerUsingPost({
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

// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 80,
  },
  {
    title: "选项",
    dataIndex: "choices",
    width: 100,
  },
  {
    title: "结果 id",
    dataIndex: "resultId",
    width: 120,
  },
  {
    title: "名称",
    dataIndex: "resultName",
    width: 150,
  },
  {
    title: "描述",
    dataIndex: "resultDesc",
    width: 200,
  },
  {
    title: "图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
    width: 80,
  },
  {
    title: "得分",
    dataIndex: "resultScore",
    width: 100,
  },
  {
    title: "应用 id",
    dataIndex: "appId",
    width: 120,
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
    width: 120,
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "scoringStrategy",
    width: 150,
  },
  {
    title: "用户 id",
    dataIndex: "userId",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
    width: 180,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
    width: 180,
  },
  {
    title: "操作",
    slotName: "optional",
    fixed: "right",
    width: 100,
  },
];
</script>

<style scoped>
/* 自定义表格样式 */
.highlight-row {
  background-color: #f6ffed;
}
</style>
