<template>
  <div
    class="bg-white rounded-md shadow-soft-lg overflow-hidden"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiCard",
  props: { ariaLabel: { type: String, default: "card" } },
});
</script>

<style scoped>
div {
  transition: box-shadow 0.2s ease;
}
div:hover {
  box-shadow: 0 15px 40px rgba(26, 26, 26, 0.12);
}
</style>
