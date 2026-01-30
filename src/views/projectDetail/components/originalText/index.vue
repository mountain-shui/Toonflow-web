<template>
  <div class="overviewMain">
    <!-- 头部 -->
    <div class="overviewHeader">
      <h2 class="overviewTitle">小说原文</h2>
      <p class="overviewSub">查看小说原文</p>
    </div>

    <!-- 操作栏 -->
    <div class="smSummary jb">
      <div class="f">
        <i-file-text :size="24" class="smSummaryIcon mr-3" />
        <span class="smSummaryTitle">原文管理</span>
      </div>
      <button class="smSummaryBtn" @click="purgeNovelShow = true">
        <i-optimize :size="16" />
        新增
      </button>
    </div>

    <!-- 表格 -->
    <vxe-table
      ref="tableRef"
      :data="originalList"
      :row-config="{ isHover: true }"
      :checkbox-config="{ highlight: true, trigger: 'row' }"
      height="500"
      style="margin-top: 12px">
      <vxe-column field="index" title="章" width="100" />
      <vxe-column field="reel" title="卷" width="100" />
      <vxe-column field="chapter" title="章节名称" width="200" show-overflow="title" />
      <vxe-column field="chapterData" title="章节内容" show-overflow="title" />
      <vxe-column title="操作" width="100">
        <template #default="{ row }">
          <div class="actionBtns">
            <i-edit size="21" @click="handleEdit(row)" />
            <a-popconfirm title="确定要删除吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(row)">
              <i-delete size="21" />
            </a-popconfirm>
          </div>
        </template>
      </vxe-column>
    </vxe-table>

    <!-- 新增弹窗 -->
    <purgeNovel v-model="purgeNovelShow" @select="handleAddChapters" />

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModal" width="60vw" title="编辑原文" @ok="handleUpdate">
      <div class="editModalContent">
        <a-form :model="formData" layout="vertical">
          <a-form-item label="章" required>
            <a-input v-model:value="formData.index" type="number" />
          </a-form-item>
          <a-form-item label="卷" required>
            <a-input v-model:value="formData.reel" />
          </a-form-item>
          <a-form-item label="章节名称" required>
            <a-input v-model:value="formData.chapter" />
          </a-form-item>
          <a-form-item label="章节内容" required>
            <a-textarea v-model:value="formData.chapterData" :auto-size="{ minRows: 5, maxRows: 20 }" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import axios from "@/utils/axios";
import purgeNovel from "./components/purgeNovel.vue";
import store from "@/stores";
const { projectId } = storeToRefs(store());

interface OriginalText {
  id: number;
  index: number;
  reel: string;
  chapter: string;
  chapterData: string;
}

interface ChapterItem {
  index: number;
  reel: string;
  chapter: string;
  chapterData: string;
}

const originalList = ref<OriginalText[]>([]);
const purgeNovelShow = ref(false);
const editModal = ref(false);
const formData = ref<OriginalText>({ id: -1, index: 0, reel: "", chapter: "", chapterData: "" });

// 获取小说列表
const getNovel = () => {
  axios.post("/novel/getNovel", { projectId: projectId.value }).then((res) => {
    originalList.value = res.data;
  });
};

// 新增章节
const handleAddChapters = (chapters: ChapterItem[]) => {
  axios.post("/novel/addNovel", { projectId: projectId.value, data: chapters }).then(() => {
    getNovel();
    purgeNovelShow.value = false;
  });
};

// 编辑
const handleEdit = (row: OriginalText) => {
  formData.value = { ...row };
  editModal.value = true;
};

// 更新
const handleUpdate = () => {
  axios.post("/novel/updateNovel", formData.value).then(() => {
    getNovel();
    message.success("更新成功");
    editModal.value = false;
  });
};

// 删除
const handleDelete = (row: OriginalText) => {
  axios.post("/novel/delNovel", { id: row.id }).then(() => {
    getNovel();
  });
};

onMounted(getNovel);
</script>

<style lang="scss" scoped>
.overviewHeader {
  margin-bottom: 32px;
  .overviewTitle {
    font-size: 22px;
    font-weight: 600;
    color: #222;
    margin-bottom: 8px;
  }
  .overviewSub {
    color: #888;
  }
}

.smSummary {
  display: flex;
  align-items: center;
  padding: 15px;
  background: linear-gradient(90deg, #faf5ff, #eff6ff);
  border-radius: 0.75rem;

  .smSummaryIcon {
    color: #9333ea;
  }
  .smSummaryTitle {
    font-weight: 600;
    color: #111827;
    font-size: 1rem;
  }
  .smSummaryBtn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #fff;
    color: #9333ea;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    &:hover {
      background: #f3f4f6;
    }
  }
}

.actionBtns {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
}

.editModalContent {
  max-height: 700px;
  overflow-y: auto;
}
</style>
