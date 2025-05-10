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
        :validate-status="nameStatus"
        :feedback="nameFeedback"
        :rules="[
          { required: true, message: '请输入应用名称' },
          { max: 100, message: '应用名称不能超过100个字' },
        ]"
      >
        <template #help>
          <span v-if="nameStatus !== 'error'">请输入应用名称，不可为空</span>
        </template>
        <a-input
          v-model="form.appName"
          placeholder="请输入应用名称"
          @input="() => handleValidation('appName')"
          @blur="() => handleValidation('appName')"
        />
      </a-form-item>

      <!-- 应用描述 -->
      <a-form-item
        field="appDesc"
        label="应用描述"
        :validate-status="descStatus"
        :feedback="descFeedback"
        :rules="[
          { required: true, message: '请输入应用描述' },
          { max: 25, message: '应用描述不能超过25个字' },
        ]"
      >
        <template #help>
          <span v-if="descStatus !== 'error'"
            >请输入应用描述，不超过25个字</span
          >
        </template>
        <a-input
          v-model="form.appDesc"
          placeholder="请输入应用描述"
          @input="() => handleValidation('appDesc')"
          @blur="() => handleValidation('appDesc')"
        />
      </a-form-item>

      <!-- 应用图标 -->
      <a-form-item
        field="appIcon"
        label="应用图标"
        help="请输入应用图标URL，格式为：https://s2.loli.net/2025/04/07/5wPbMFBusDjqOTG.jpg"
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
import type { FieldRule } from "@arco-design/web-vue/es/form/interface";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "../../api/appController";
import message from "@arco-design/web-vue/es/message";

type ValidateStatus = "success" | "error" | "validating" | undefined;

const router = useRouter();
const form = reactive({
  appName: "",
  appDesc: "",
  appIcon: "",
  appType: 0,
  scoringStrategy: 0,
});

// 校验状态管理
const nameStatus = ref<ValidateStatus>();
const nameFeedback = ref("");
const descStatus = ref<ValidateStatus>();
const descFeedback = ref("");

const props = defineProps<{ id?: string }>();
const oldApp = ref(null);

// 校验逻辑
const validateField = (value: string, rules: FieldRule[]) => {
  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return { status: "error", message: rule.message };
    }
    if (rule.max && value.length > rule.max) {
      return { status: "error", message: rule.message };
    }
  }
  return { status: "success", message: "" };
};

const handleValidation = (field: "appName" | "appDesc") => {
  let rules: FieldRule[];
  let value: string;

  if (field === "appName") {
    rules = [
      { required: true, message: "请输入应用名称" },
      { max: 100, message: "应用名称不能超过100个字" },
    ];
    value = form.appName;
    const result = validateField(value, rules);
    nameStatus.value = result.status;
    nameFeedback.value = result.message;
  } else {
    rules = [
      { required: true, message: "请输入应用描述" },
      { max: 25, message: "应用描述不能超过25个字" },
    ];
    value = form.appDesc;
    const result = validateField(value, rules);
    descStatus.value = result.status;
    descFeedback.value = result.message;
  }
};

// 其他原有逻辑保持完全一致
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

const handleSubmit = async () => {
  // 提交前强制校验
  handleValidation("appName");
  handleValidation("appDesc");

  if (nameStatus.value === "error" || descStatus.value === "error") {
    return message.error("请先修正表单错误");
  }

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
</script>
