<template>
  <div
    id="userManagementPage"
    :style="{
      padding: '20px',
      background: 'linear-gradient(to bottom right, #f0f4f8, #d9e4ec)',
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
      title="用户搜索"
    >
      <a-form :model="formSearchParams" layout="inline" @submit="doSearch">
        <a-form-item field="userProfile" label="ID">
          <a-input
            allow-clear
            v-model="formSearchParams.id"
            placeholder="请输入用户ID"
          />
        </a-form-item>
        <a-form-item field="userName" label="用户名">
          <a-input
            allow-clear
            v-model="formSearchParams.userName"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item field="userProfile" label="用户描述">
          <a-input
            allow-clear
            v-model="formSearchParams.userProfile"
            placeholder="请输入用户描述"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :style="{ width: '100px', borderRadius: '8px' }"
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
      >
        <template #userAvatar="{ record }">
          <a-image
            width="64"
            :src="record.userAvatar"
            style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
          />
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
              :style="{ borderRadius: '8px' }"
              >删除
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
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";

const formSearchParams = ref<API.UserQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.UserQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.User[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listUserByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.User) => {
  if (!record.id) {
    return;
  }

  const res = await deleteUserUsingPost({
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
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "用户头像",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
  },
  {
    title: "用户描述信息",
    dataIndex: "userProfile",
  },
  {
    title: "权限",
    dataIndex: "userRole",
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
#userManagementPage {
  padding: 20px;
  background: linear-gradient(to bottom right, #f0f4f8, #d9e4ec);
}

a-card {
  margin-bottom: 20px;
}

a-card .ant-card-body {
  padding: 24px;
}

a-table {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

a-table th {
  background: #f5f5f5;
}

a-table td {
  background: #ffffff;
}

a-table td:hover {
  background: #f5f7fa;
}
</style>
