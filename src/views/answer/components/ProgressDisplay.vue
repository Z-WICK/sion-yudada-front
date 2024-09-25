<template>
  <a-progress
    :percent="progress"
    :style="{ width: '50%' }"
    :color="{
      '0%': 'rgb(var(--primary-6))',
      '100%': 'rgb(var(--success-6))',
    }"
  />
</template>

<script>
export default {
  name: "ProgressDisplay",
  props: {
    currentProgress: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
  },
  computed: {
    progress() {
      return this.currentProgress / this.totalQuestions;
    },
  },
};
</script>

<style scoped></style>
