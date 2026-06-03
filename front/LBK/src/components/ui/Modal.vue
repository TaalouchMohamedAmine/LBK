<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @keydown.esc="$emit('close')"
  >
    <div
      class="bg-white rounded-md max-w-lg w-full p-6"
      role="dialog"
      aria-modal="true"
    >
      <header class="flex justify-end">
        <button @click="$emit('close')" aria-label="Close" class="text-brand">
          ✕
        </button>
      </header>
      <div class="mt-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UiModal",
  props: { open: { type: Boolean, required: true } },
});
</script>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-brand);
}
</style>
