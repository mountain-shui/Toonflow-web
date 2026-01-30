<template>
  <div class="storyline-container">
    <!-- 头部区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">故事线管理</h1>
        <p class="page-desc">根据上传的小说原文生成大纲和故事线</p>
      </div>
      <a-button type="primary" class="edit-btn" @click="handleAddStoreline">
        <i-edit :size="16" v-if="!storylineChanged" />
        <i-preview-open :size="16" v-else />
        {{ storylineChanged ? "预览模式" : "编辑故事线" }}
      </a-button>
    </div>

    <!-- 内容区域 -->
    <div class="storyline-content">
      <div class="content-card">
        <!-- 有内容时 -->
        <template v-if="storyLine || storylineChanged">
          <!-- 预览模式 -->
          <div class="preview-box" v-if="!storylineChanged">
            <div class="preview-header">
              <span class="preview-icon">📖</span>
              <span class="preview-title">故事线内容</span>
            </div>
            <div class="preview-text">{{ storyLine }}</div>
          </div>

          <!-- 编辑模式 -->
          <div class="edit-box" v-else>
            <div class="edit-header">
              <span class="edit-icon">✏️</span>
              <span class="edit-title">编辑故事线</span>
              <span class="edit-tip">支持多行输入，描述完整的故事脉络</span>
            </div>
            <a-textarea
              v-model:value="storyLine"
              placeholder="请输入故事线，包括主要情节、角色发展、冲突转折等..."
              class="storyline-textarea"
              :auto-size="{ minRows: 12, maxRows: 24 }"
              :maxlength="5000"
              show-count
              @change="handleChange" />
          </div>
        </template>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <div class="empty-icon">📝</div>
          <p class="empty-title">暂无故事线</p>
          <p class="empty-desc">点击上方"编辑故事线"开始创作</p>
          <a-button type="primary" class="empty-btn" @click="handleAddStoreline">开始编辑</a-button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-bar" v-if="storylineChanged">
        <div class="action-tips"></div>
        <div class="action-btns">
          <a-button class="cancel-btn" @click="handleCancel">取消</a-button>
          <a-button type="primary" class="save-btn" @click="save">
            <i-check :size="16" />
            保存
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const storyLine = defineModel<string>({
  default: "",
});

const storylineChanged = ref(false);
const storylineBackup = ref("");

const emit = defineEmits(["save"]);

function handleAddStoreline() {
  storylineChanged.value = !storylineChanged.value;
  if (storylineChanged.value) {
    storylineBackup.value = storyLine.value;
  }
}

function handleChange() {
  storylineChanged.value = true;
}

function handleCancel() {
  storyLine.value = storylineBackup.value;
  storylineChanged.value = false;
}

function save() {
  emit("save", storyLine.value);
  storylineChanged.value = false;
}
</script>

<style lang="scss" scoped>
.storyline-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fc;
  min-height: 100%;
}

// 头部样式
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 24px;
  background: var(--mainGradient);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(152, 16, 250, 0.25);

  .header-content {
    .page-title {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 6px;
      color: #fff;
    }
    .page-desc {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .edit-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #fff;
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.35);
      border-color: #fff;
      transform: translateY(-1px);
    }
  }
}

// 内容区域
.storyline-content {
  .content-card {
    background: #fff;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid #f0f0f0;
  }
}

// 预览模式
.preview-box {
  padding: 24px;

  .preview-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .preview-icon {
      font-size: 20px;
    }

    .preview-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }

  .preview-text {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.8;
    color: #444;
    font-size: 14px;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #d0d0d0;
    }
  }
}

// 编辑模式
.edit-box {
  padding: 24px;

  .edit-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;

    .edit-icon {
      font-size: 18px;
    }

    .edit-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .edit-tip {
      margin-left: auto;
      font-size: 12px;
      color: #999;
    }
  }

  .storyline-textarea {
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.8;
    transition: all 0.3s;
    resize: none;

    &:hover {
      outline: none;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(152, 16, 250, 0.1);
    }

    &::placeholder {
      color: #bbb;
    }
  }
}

// 空状态
.empty-state {
  padding: 80px 20px;
  text-align: center;

  .empty-icon {
    font-size: 56px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: #999;
    margin: 0 0 24px;
  }

  .empty-btn {
    background: var(--mainGradient);
    border: none;
    height: 42px;
    padding: 0 28px;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      background: var(--mainGradientHover);
    }
  }
}

// 操作栏
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;

  .action-tips {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #999;
  }

  .action-btns {
    display: flex;
    gap: 12px;

    .cancel-btn {
      height: 38px;
      padding: 0 20px;
      border-radius: 8px;
      font-weight: 500;

      &:hover {
        border-color: var(--mainColor);
        color: var(--mainColor);
      }
    }

    .save-btn {
      height: 38px;
      padding: 0 24px;
      border-radius: 8px;
      background: var(--mainGradient);
      border: none;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;

      &:hover {
        background: var(--mainGradientHover);
      }
    }
  }
}

// 滚动条美化
:deep(.ant-input-textarea-show-count::after) {
  font-size: 12px;
  color: #bbb;
}

:deep(.ant-input-data-count) {
  font-size: 12px;
  color: #bbb;
}
</style>
