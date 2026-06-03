<template>
  <button
    :class="computedClass"
    :aria-label="ariaLabel"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "UiButton",
  props: {
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    disabled: { type: Boolean, default: false },
    ariaLabel: { type: String, default: "" },
  },
  setup(props) {
    const computedClass = computed(() => {
      const base = "button";
      const sizeClass = `button-${props.size}`;
      const variantClass =
        props.variant === "primary"
          ? "button-primary"
          : props.variant === "ghost"
            ? "button-ghost"
            : "button-outline";
      return `${base} ${sizeClass} ${variantClass}`;
    });

    return { computedClass };
  },
});
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
