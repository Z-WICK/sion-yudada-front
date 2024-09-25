<template>
  <div id="homePage">
    <div class="searchBar">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="查询"
        button-text="搜索"
        size="large"
        search-button
        @search="onSearch"
      />
    </div>
    <a-list
      class="list-demo-action-layout"
      :bordered="false"
      :data="dataList"
      :pagination-props="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #item="{ item }">
        <!-- 每个卡片占据整行 -->
        <AppCard :app="item" />
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AppCard from "@/components/AppCard.vue";
import API from "@/api";
import { listAppVoByPageUsingPost } from "@/api/appController";
import message from "@arco-design/web-vue/es/message";
import { REVIEW_STATUS_ENUM } from "@/constant/app";

// 初始化搜索条件
const initSearchParams = {
  current: 1,
  pageSize: 12,
  keyword: "",
};

const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.AppVO[]>([]);
const total = ref<number>(0);

// 加载数据
const loadData = async () => {
  const params = {
    reviewStatus: REVIEW_STATUS_ENUM.PASS,
    ...searchParams.value,
  };
  const res = await listAppVoByPageUsingPost(params);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

// 分页变化时，更新数据
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

// 搜索按钮
const onSearch = async (value: string) => {
  searchParams.value = {
    ...searchParams.value,
    keyword: value,
    current: 1,
  };
  await loadData();
};

watchEffect(
  () => {
    loadData();
  },
  { flush: "post" }
);
</script>

<style scoped>
#homePage {
}

.searchBar {
  margin-bottom: 28px;
  text-align: center;
}

.list-demo-action-layout .list-demo-item {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}
</style>
