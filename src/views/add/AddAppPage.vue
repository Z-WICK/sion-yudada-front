<template>
  <div
    style="
      display: flex;
      justify-content: center;
      gap: 50px;
      padding: 20px;
      background-color: #f0f2f5;
    "
  >
    <!-- 左侧表单 -->
    <a-form
      :model="form"
      :style="{
        width: '600px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }"
      @submit="handleSubmit"
    >
      <!-- 应用名称 -->
      <a-form-item
        field="appName"
        label="应用名称"
        help="请输入应用名称，不超过10个字"
        :validate-status="status"
        feedback
        :rules="[
          { required: true, message: '请输入应用名称' },
          { max: 10, message: '应用名称不能超过10个字' },
        ]"
      >
        <a-input
          v-model="form.appName"
          placeholder="请输入应用名称"
          @input="handleValidating"
          @blur="handleValidation('appName')"
        />
      </a-form-item>

      <!-- 应用描述 -->
      <a-form-item
        field="appDesc"
        label="应用描述"
        help="请输入应用描述，不超过25个字"
        :validate-status="status"
        feedback
        :rules="[
          { required: true, message: '请输入应用描述' },
          { max: 25, message: '应用描述不能超过25个字' },
        ]"
      >
        <a-input
          v-model="form.appDesc"
          placeholder="请输入应用描述"
          @input="handleValidating"
          @blur="handleValidation('appDesc')"
        />
      </a-form-item>

      <!-- 应用图标 -->
      <a-form-item
        field="appIcon"
        label="应用图标"
        help="请输入应用图标URL，格式为：https://s2.loli.net/2024/09/17/ezrd7qsOD5ijT1l.jpg"
      >
        <a-input v-model="form.appIcon" placeholder="请输入应用图标URL" />
      </a-form-item>

      <!-- 应用类型 -->
      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          :style="{ width: '100%' }"
          placeholder="请选择应用类型"
        >
          <a-option
            v-for="(value, key) in APP_TYPE_MAP"
            :value="Number(key)"
            :key="key"
            >{{ value }}
          </a-option>
        </a-select>
      </a-form-item>

      <!-- 评分策略 -->
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          :style="{ width: '100%' }"
          placeholder="请选择评分策略"
        >
          <a-option
            v-for="(value, key) in APP_SCORING_STRATEGY_MAP"
            :value="Number(key)"
            :key="key"
            >{{ value }}
          </a-option>
        </a-select>
      </a-form-item>

      <!-- 提交按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          {{ props.id ? "更新应用信息" : "点击创建" }}
        </a-button>
      </a-form-item>
    </a-form>

    <!-- 右侧图标预览框 -->
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 150px;
          height: 150px;
          border: 2px dashed #ccc;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
        "
      >
        <img
          v-if="form.appIcon"
          :src="form.appIcon"
          alt="App Icon"
          style="max-width: 100%; max-height: 100%; object-fit: contain"
        />
        <span v-else style="color: #999">预览图标</span>
      </div>
      <p style="color: #888; font-size: 12px">请输入有效的图标URL进行预览</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "@/api/appController";
import message from "@arco-design/web-vue/es/message";

const router = useRouter();
const status = ref("validating");
const form = reactive({
  appName: "",
  appDesc: "",
  appIcon: "",
  appType: 0,
  scoringStrategy: 0,
});

const props = defineProps<{ id?: string }>();
const oldApp = ref(null);

/**
 * 加载数据
 */
const loadData = async () => {
  if (props.id) {
    const res = await getAppVoByIdUsingGet({ id: props.id });
    if (res.data.code === 0 && res.data.data) {
      oldApp.value = res.data.data;
      Object.assign(form, res.data.data);
    } else {
      message.error("获取数据失败，" + res.data.message);
    }
  }
};

watchEffect(() => {
  loadData();
});

/**
 * 提交
 */
const handleSubmit = async () => {
  let res;
  if (props.id) {
    res = await editAppUsingPost({ id: props.id, ...form });
  } else {
    res = await addAppUsingPost(form);
  }

  if (res.data.code === 0) {
    message.success("正在创建⏰请稍等");
    setTimeout(() => {
      router.push(`/result/success/${props.id || res.data.data}`);
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};

const handleValidating = () => {
  status.value = "validating";
};

const handleValidation = (field) => {
  if (form[field]) {
    status.value = "success";
  } else {
    status.value = "error";
  }
};
</script>
