<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/a196.svg" class="logo" />
          <div>Sion AITest Platforms</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://space.bilibili.com/159568427" target="_blank">
          © 2024 Sion Networks Inc.
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: white 0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 48px;
  height: 48px;
}

#userLayout .header {
  margin-top: 16px;
  font-size: 21px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px;
  text-align: center;
}
</style>
