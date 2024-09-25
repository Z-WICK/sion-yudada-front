<template>
  <div>
    <a-collapse :default-active-key="[0]" accordion>
      <a-collapse-item
        v-for="(question, index) in questionContent"
        :key="index"
        :header="`题目 ${index + 1}: ${question.title}`"
      >
        <div>
          <h4>题目描述: {{ question.title }}</h4>
          <ul>
            <li
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
            >
              <span
                >选项 {{ optionIndex + 1 }} : {{ option.key }} | 答案:
                {{ option.value }} | 得分: {{ option.score }}
              </span>
            </li>
          </ul>
        </div>
      </a-collapse-item>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  questionContent: Array<{
    title: string;
    options: Array<{
      key: string;
      value: string;
      score: number;
    }>;
  }>;
}>();
</script>
