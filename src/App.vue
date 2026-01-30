<template>
  <el-config-provider>
    <a-config-provider :theme="theme" :locale="zhCN">
      <router-view></router-view>
    </a-config-provider>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
const theme = {
  token: {
    colorPrimary: "#9810fa",
  },
};
</script>

<style lang="scss"></style>
