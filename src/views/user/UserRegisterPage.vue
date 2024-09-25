<template xmlns:justify-content="http://www.w3.org/1999/xhtml">
  <div id="userRegisterPage">
    <h2 style="margin-bottom: 16px">欢迎👏加入Sion AITest</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账户">
        <a-input v-model="form.userAccount" placeholder="请输入你的账户密码" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="不可低于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入你的账户密码"
        />
      </a-form-item>

      <a-form-item
        field="checkPassword"
        tooltip="哥们,真别低于8位"
        label="密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请输入你的账户密码"
        />
      </a-form-item>

      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px"
            >注册
          </a-button>
          <a href="/user/login">已有账户</a>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import {
  userLoginUsingPost,
  userRegisterUsingPost,
} from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as API.UserRegisterRequest);
const handleSubmit = async () => {
  const res = await userRegisterUsingPost(form);
  if (res.data.code === 0) {
    message.success("欢迎加入👏");
    //登录成功返回首页
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败" + res.data.message);
  }
};
</script>
