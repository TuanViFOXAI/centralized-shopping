<script setup>
import { useLayout } from "@/layout/composables/layout";
import { computed } from "vue";

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
  return `https://fox.ai.vn/wp-content/uploads/2023/09/logo-fox.png`;
});
</script>

<template>
  <div class="layout-footer flex justify-content-center py-3">
    <a href="https://fox.ai.vn/">
      <img
        src="../assets/img/logo/Logo_Original.png"
        alt="Logo"
        width="50"
        class="mr-2"
      />
    </a>
    <a href="https://fox.ai.vn/" class="font-medium ml-2">Designed by FoxAi</a>
  </div>
</template>
<style lang="scss" scoped></style>
