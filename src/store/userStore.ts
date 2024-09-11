import { defineStore } from "pinia"; // 从 Pinia 中引入 defineStore，用于定义 Store
import { ref } from "vue"; // 从 Vue 中引入 ref，用于创建响应式变量
import { getLoginUserUsingGet } from "@/api/userController";
import AccessEnum from "@/access/accessEnum"; // 引入获取登录用户信息的 API 接口

// 定义名为 "loginUser" 的 Store，用于管理登录用户信息
export const useLoginUserStore = defineStore("loginUser", () => {
  // 创建一个响应式的 loginUser 变量，初始值为一个包含 userName 字段的对象，表示未登录状态
  const loginUser = ref<API.LoginUserVO>({
    userName: "未登录", // 初始状态下用户名显示为 "未登录"
  });

  // 定义一个函数，手动设置新的登录用户信息
  function setLoginUser(newLoginUser: API.LoginUserVO) {
    loginUser.value = newLoginUser; // 将传入的新用户数据赋值给 loginUser
  }

  // 异步函数，用于从后端获取登录用户信息
  async function fetchLoginUser() {
    // 调用 API 接口获取登录用户的数据
    const res = await getLoginUserUsingGet();

    // 如果返回结果的状态码为 0 且数据存在，更新 loginUser 的值
    if (res.data.code === 0 && res.data.data) {
      loginUser.value = res.data.data; // 将获取到的用户数据赋值给 loginUser
    } else {
      // 如果获取失败，将 loginUser 设置为未登录状态
      loginUser.value = { userRole: AccessEnum.NOT_LOGIN };
    }
  }

  // 返回 Store 的 state 和方法，以便在组件中使用
  return { loginUser, setLoginUser, fetchLoginUser };
});
