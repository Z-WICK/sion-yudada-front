<template xmlns:justify-content="http://www.w3.org/1999/xhtml">
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">欢迎👏回来</h2>
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
            >登录
          </a-button>

          <a href="/user/register">新用户注册</a>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userLoginUsingPost } from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const loginUserStore = useLoginUserStore();
const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as API.UserLoginRequest);
const handleSubmit = async () => {
  console.log(form);
  const res = await userLoginUsingPost(form);
  if (res.data.code === 0) {
    await loginUserStore.fetchLoginUser();
    message.success("欢迎回来👏");
    //登录成功返回首页
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登录失败" + res.data.message);
  }
};
</script>
