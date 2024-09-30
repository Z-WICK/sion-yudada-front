<template>
  <div
    id="answerResultPage"
    :style="{
      background: 'linear-gradient(to bottom right, #f0f4f8, #d9e4ec)',
      padding: '20px',
    }"
  >
    <a-card
      :style="{
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        marginBottom: '24px',
      }"
    >
      <!-- 标题区块 -->
      <h2
        :style="{
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '8px',
          marginBottom: '24px',
          fontSize: '24px',
          fontWeight: 'bold',
        }"
      >
        {{ data.resultName }}
      </h2>

      <a-row>
        <!-- 左侧内容区 -->
        <a-col
          flex="auto"
          class="content-wrapper"
          :style="{ paddingRight: '24px' }"
        >
          <a-card
            :style="{
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: '#f9fafc',
            }"
          >
            <h3 :style="{ marginBottom: '16px', fontWeight: 'bold' }">
              <a-icon type="profile" />
              结果信息
            </h3>
            <p>
              <a-icon type="info-circle" />
              结果描述：{{ data.resultDesc }}
            </p>
            <p>
              <a-icon type="number" />
              结果 id：{{ data.resultId }}
            </p>
            <p>
              <a-icon type="star" />
              结果得分：{{ data.resultScore }}
            </p>
            <p>
              <a-icon type="solution" />
              我的答案：{{ data.choices }}
            </p>
          </a-card>

          <a-card
            :style="{
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: '#f9fafc',
            }"
          >
            <h3 :style="{ marginBottom: '16px', fontWeight: 'bold' }">
              <a-icon type="appstore" />
              应用信息
            </h3>
            <p>
              <a-icon type="project" />
              应用 id：{{ data.appId }}
            </p>
            <p>
              <a-icon type="bars" />
              应用类型：{{ APP_TYPE_MAP[data.appType] }}
            </p>
            <p>
              <a-icon type="filter" />
              评分策略：{{ APP_SCORING_STRATEGY_MAP[data.scoringStrategy] }}
            </p>
          </a-card>

          <a-card :style="{ borderRadius: '8px', backgroundColor: '#f9fafc' }">
            <h3 :style="{ marginBottom: '16px', fontWeight: 'bold' }">
              <a-icon type="user" />
              答题人信息
            </h3>

            <a-icon type="user" />
            答题人:
            <div :style="{ display: 'flex', alignItems: 'center' }">
              <a-avatar
                :size="24"
                :image-url="data.user?.userAvatar"
                :style="{ marginRight: '8px' }"
              />
              <a-typography-text>{{
                data.user?.userName ?? "匿名用户"
              }}</a-typography-text>
            </div>

            <a-icon type="clock-circle" />
            答题时间：
            {{ dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </a-card>
        </a-col>

        <!-- 右侧图片区 -->
        <a-col flex="320px">
          <a-card
            :style="{
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
            }"
          >
            <a-image
              width="100%"
              :src="data.resultPicture"
              :style="{ borderRadius: '12px', transition: 'transform 0.3s' }"
              @mouseenter="$event.target.style.transform = 'scale(1.05)'"
              @mouseleave="$event.target.style.transform = 'scale(1)'"
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- 底部按钮区 -->
      <a-row justify="end">
        <a-space size="medium">
          <a-button type="primary" :href="`/answer/do/${data.appId}`"
            >去答题</a-button
          >
        </a-space>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { getUserAnswerVoByIdUsingGet } from "@/api/userAnswerController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "../../constant/app";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return "";
  },
});

const router = useRouter();

const data = ref<API.UserAnswerVO>({});

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getUserAnswerVoByIdUsingGet({
    id: props.id as any,
  });
  if (res.data.code === 0) {
    data.value = res.data.data as any;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#answerResultPage {
  padding: 20px;
}

#answerResultPage .content-wrapper > * {
  margin-bottom: 24px;
}
</style>
