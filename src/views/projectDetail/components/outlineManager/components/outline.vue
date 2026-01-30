<template>
  <div class="outline-container">
    <!-- 头部区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">大纲管理</h1>
        <p class="page-desc">每一集的详细内容</p>
      </div>
      <a-button type="primary" class="add-btn" @click="handleAddOutline">
        <i-plus :size="16" />
        新增大纲
      </a-button>
    </div>

    <!-- 大纲列表 -->
    <div class="outline-list" v-if="displayData.length">
      <div v-for="(item, index) in displayData" :key="item.id ?? index" class="outline-card">
        <div class="card-header">
          <div class="episode-badge">第 {{ item.episodeIndex }} 集</div>
          <div class="card-title">{{ item.title || "未命名" }}</div>
          <div class="card-actions">
            <a-button type="text" size="small" class="action-btn" @click="startEdit(index)">
              <i-edit :size="16" />
            </a-button>
            <a-button type="text" size="small" class="action-btn danger" @click="handleDelete(item)">
              <i-delete :size="16" />
            </a-button>
          </div>
        </div>

        <div class="card-body">
          <a-row :gutter="[16, 8]">
            <a-col :span="24">
              <div class="field-group highlight">
                <span class="field-icon">📖</span>
                <span class="field-label">章节范围</span>
                <span class="field-value">{{ formatChapterIndexes(item.chapterRange) }}</span>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="field-group">
                <span class="field-icon">🎬</span>
                <span class="field-label">场景</span>
                <span class="field-value">{{ formatObjectArray(item.scenes) }}</span>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="field-group">
                <span class="field-icon">👥</span>
                <span class="field-label">角色</span>
                <span class="field-value">{{ formatObjectArray(item.characters) }}</span>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="field-group">
                <span class="field-icon">🎁</span>
                <span class="field-label">道具</span>
                <span class="field-value">{{ formatObjectArray(item.props) }}</span>
              </div>
            </a-col>

            <a-col :span="12">
              <div class="field-group">
                <span class="field-icon">🎯</span>
                <span class="field-label">核心冲突</span>
                <span class="field-value">{{ item.coreConflict || "—" }}</span>
              </div>
            </a-col>

            <a-col :span="12">
              <div class="field-group">
                <span class="field-icon">⚡</span>
                <span class="field-label">黄金3秒</span>
                <span class="field-value">{{ item.openingHook || "—" }}</span>
              </div>
            </a-col>

            <a-col :span="24" v-if="item.outline">
              <div class="field-group outline-field">
                <div class="field-header">
                  <span class="field-icon">📝</span>
                  <span class="field-label">剧情主干</span>
                </div>
                <p class="field-content">{{ item.outline }}</p>
              </div>
            </a-col>
          </a-row>

          <!-- 标签展示区 -->
          <div class="tags-section" v-if="item.keyEvents?.length || item.classicQuotes?.length">
            <div class="tag-group" v-if="item.keyEvents?.length">
              <span class="tag-label">关键节点</span>
              <div class="tag-list">
                <span v-for="(event, i) in item.keyEvents.slice(0, 3)" :key="i" class="custom-tag blue">{{ event }}</span>
                <span v-if="item.keyEvents.length > 3" class="custom-tag more">+{{ item.keyEvents.length - 3 }}</span>
              </div>
            </div>
            <div class="tag-group" v-if="item.classicQuotes?.length">
              <span class="tag-label">金句</span>
              <div class="tag-list">
                <span v-for="(quote, i) in item.classicQuotes.slice(0, 2)" :key="i" class="custom-tag purple">{{ quote }}</span>
                <span v-if="item.classicQuotes.length > 2" class="custom-tag more">+{{ item.classicQuotes.length - 2 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">📋</div>
      <p class="empty-text">暂无大纲数据</p>
      <a-button type="primary" class="empty-btn" @click="handleAddOutline">创建第一个大纲</a-button>
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      :title="isAddMode ? '新增大纲' : '编辑大纲'"
      width="900px"
      :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', padding: '20px' }"
      @ok="saveEdit"
      @cancel="cancelEdit"
      okText="保存"
      cancelText="取消"
      class="outline-modal">
      <a-form v-if="editTemp" layout="vertical" :model="editTemp" class="outline-form">
        <!-- 基础信息 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon">📌</span>
            基础信息
          </div>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="集数">
                <a-input-number v-model:value="editTemp.episodeIndex" :min="1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="标题">
                <a-input v-model:value="editTemp.title" :maxlength="100" show-count placeholder="请输入本集标题" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="章节范围">
                <div class="chapter-selector">
                  <a-button class="select-btn" @click="openChapterSelector">
                    <i-plus :size="14" />
                    选择章节
                  </a-button>
                  <span class="selected-text">{{ formatChapterIndexes(editTemp.chapterRange) || "未选择章节" }}</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 资产关联 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon">🔗</span>
            资产关联
          </div>
          <a-row :gutter="16">
            <a-col :span="8" v-for="assetField in ['scenes', 'characters', 'props']" :key="assetField">
              <a-form-item :label="getAssetLabel(assetField)">
                <div class="asset-box">
                  <div class="asset-tags">
                    <span v-for="(obj, idx) in editTemp[assetField as keyof Outline] as ObjectItem[]" :key="idx" class="asset-tag">
                      {{ obj.name }}
                      <i-close :size="12" class="close-icon" @click="removeObjectItem(assetField, idx)" />
                    </span>
                  </div>
                  <a-button type="dashed" size="small" class="add-asset-btn" @click="addObjectItem(assetField)">
                    <i-plus :size="12" />
                    添加
                  </a-button>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 剧情设计 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon">🎭</span>
            剧情设计
          </div>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="黄金3秒">
                <a-input v-model:value="editTemp.openingHook" :maxlength="100" placeholder="开头吸引观众的亮点" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结尾悬念">
                <a-input v-model:value="editTemp.endingHook" :maxlength="100" placeholder="结尾留下的悬念" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="核心冲突">
                <a-input v-model:value="editTemp.coreConflict" :maxlength="200" placeholder="本集的核心矛盾点" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="剧情主干">
                <a-textarea
                  v-model:value="editTemp.outline"
                  :auto-size="{ minRows: 4, maxRows: 8 }"
                  :maxlength="1000"
                  show-count
                  placeholder="详细描述本集剧情走向" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 补充信息 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon">💡</span>
            补充信息
          </div>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="关键节点">
                <a-select v-model:value="editTemp.keyEvents" mode="tags" placeholder="输入后回车添加" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="情绪曲线">
                <a-input v-model:value="editTemp.emotionalCurve" placeholder="如：低开高走、波浪起伏" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="视觉重点">
                <a-select v-model:value="editTemp.visualHighlights" mode="tags" placeholder="输入后回车添加" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="金句">
                <a-select v-model:value="editTemp.classicQuotes" mode="tags" placeholder="输入后回车添加" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-modal>

    <!-- 资产选择弹窗 -->
    <a-modal v-model:open="assetsSelectorVisible" @ok="handleAssetSelected" width="60vw" title="选择资产" class="asset-modal">
      <div style="height: 600px; overflow-y: auto">
        <mainElement ref="mainElementRef" way="checkbox" :radio="currentRadio" v-if="assetsSelectorVisible" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import axios from "@/utils/axios";
import { message, Modal } from "ant-design-vue";
import mainElement from "@/views/projectDetail/components/assetsManager/components/mainElement.vue";
import store from "@/stores";

const { projectId } = storeToRefs(store());

interface ObjectItem {
  name: string;
  description: string;
}

interface Outline {
  id?: number;
  episodeIndex: number;
  title: string;
  chapterRange: number[];
  scenes: ObjectItem[];
  characters: ObjectItem[];
  props: ObjectItem[];
  coreConflict: string;
  openingHook: string;
  outline: string;
  keyEvents: string[];
  emotionalCurve: string;
  visualHighlights: string[];
  endingHook: string;
  classicQuotes: string[];
}

interface ChapterData {
  id: number;
  index: string;
  chapter: string;
}

const assetLabelMap: Record<string, string> = {
  scenes: "场景",
  characters: "角色",
  props: "道具",
};

const typeMap: Record<string, "role" | "scene" | "props"> = {
  characters: "role",
  scenes: "scene",
  props: "props",
};

const defaultOutline = (): Outline => ({
  episodeIndex: 0,
  title: "",
  chapterRange: [],
  scenes: [],
  characters: [],
  props: [],
  coreConflict: "",
  openingHook: "",
  outline: "",
  keyEvents: [],
  emotionalCurve: "",
  visualHighlights: [],
  endingHook: "",
  classicQuotes: [],
});

const rawData = ref<{ id: number; episode: number; data: string }[]>([]);
const chapterList = ref<ChapterData[]>([]);
const editModalVisible = ref(false);
const editingIndex = ref<number | null>(null);
const editTemp = ref<Outline | null>(null);
const isAddMode = ref(false);
const assetsSelectorVisible = ref(false);
const currentRadio = ref<"props" | "role" | "scene">();
const mainElementRef = ref();
const assetResolve = ref<(data: any) => void>();

const displayData = computed<Outline[]>(() =>
  rawData.value.map((item) => {
    try {
      const parsed = JSON.parse(item.data);
      return { ...defaultOutline(), ...parsed, id: item.id, episodeIndex: parsed.episodeIndex || item.episode };
    } catch {
      return { ...defaultOutline(), id: item.id, episodeIndex: item.episode };
    }
  }),
);

function getAssetLabel(key: string): string {
  return assetLabelMap[key] || key;
}

function formatObjectArray(arr?: ObjectItem[]): string {
  return (
    arr
      ?.map((i) => i.name)
      .filter(Boolean)
      .join("、") || "—"
  );
}

function formatChapterIndexes(indexes?: number[]): string {
  if (!indexes?.length) return "—";
  return [...indexes]
    .sort((a, b) => a - b)
    .map((i) => {
      const ch = chapterList.value.find((c) => Number(c.index) === i);
      return ch ? `第${i}章` : `第${i}章`;
    })
    .join("、");
}

async function getData() {
  try {
    const res = await axios.post("/outline/getOutline", { projectId: projectId.value });
    rawData.value = res.data || [];
  } catch {
    message.error("获取大纲数据失败");
  }
}

async function getChapterList() {
  try {
    const res = await axios.post("/novel/getNovel", { projectId: projectId.value });
    chapterList.value = res.data || [];
  } catch {
    message.error("获取章节列表失败");
  }
}

function startEdit(index: number) {
  isAddMode.value = false;
  editingIndex.value = index;
  editTemp.value = JSON.parse(JSON.stringify(displayData.value[index]));
  editModalVisible.value = true;
}

function handleAddOutline() {
  isAddMode.value = true;
  editingIndex.value = null;
  editTemp.value = { ...defaultOutline(), episodeIndex: displayData.value.length + 1 };
  editModalVisible.value = true;
}

function cancelEdit() {
  editModalVisible.value = false;
  editingIndex.value = null;
  editTemp.value = null;
  isAddMode.value = false;
}

async function saveEdit() {
  if (!editTemp.value) return;
  try {
    const data = JSON.stringify(editTemp.value);
    if (isAddMode.value) {
      await axios.post("/outline/addOutline", { projectId: projectId.value, data });
      message.success("新增成功");
    } else {
      await axios.post("/outline/updateOutline", { id: editTemp.value.id, projectId: projectId.value, data });
      message.success("保存成功");
    }
    getData();
    cancelEdit();
  } catch {
    message.error(isAddMode.value ? "新增失败" : "保存失败");
  }
}

function handleDelete(outline: Outline) {
  Modal.warning({
    title: "高危操作",
    content: "删除大纲将会删除该大纲下的剧本和独有资产",
    okText: "确定",
    cancelText: "取消",
    closable: true,
    onOk: async () => {
      await axios.post("/outline/delOutline", { id: outline.id, projectId: projectId.value });
      message.success("删除成功");
      getData();
    },
  });
}

async function addObjectItem(key: string) {
  if (!editTemp.value) return;
  currentRadio.value = typeMap[key];
  assetsSelectorVisible.value = true;

  const data = await new Promise<{ name: string; intro: string }[]>((resolve) => {
    assetResolve.value = resolve;
  });

  (editTemp.value[key as keyof Outline] as ObjectItem[]).push(...data.map((i) => ({ name: i.name, description: i.intro })));
}

function removeObjectItem(key: string, index: number) {
  (editTemp.value?.[key as keyof Outline] as ObjectItem[])?.splice(index, 1);
}

function handleAssetSelected() {
  assetResolve.value?.(mainElementRef.value.getSelectData());
  assetsSelectorVisible.value = false;
}

function openChapterSelector() {
  // 章节选择逻辑
}

onMounted(() => {
  getData();
  getChapterList();
});

defineExpose({ getData });
</script>

<style scoped lang="scss">
.outline-container {
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

  .add-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #fff;
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.35);
      border-color: #fff;
      transform: translateY(-1px);
    }
  }
}

// 列表样式
.outline-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.outline-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(152, 16, 250, 0.12);
    border-color: var(--mainColorLight);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: var(--mainColorLight);
    border-bottom: 1px solid rgba(152, 16, 250, 0.1);

    .episode-badge {
      background: var(--mainGradient);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-right: 14px;
      box-shadow: 0 2px 8px rgba(152, 16, 250, 0.3);
    }

    .card-title {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .card-actions {
      display: flex;
      gap: 4px;

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: all 0.2s;

        &:hover {
          background: var(--mainColorLight);
          color: var(--mainColor);
        }

        &.danger:hover {
          background: #fff1f0;
          color: #ff4d4f;
        }
      }
    }
  }

  .card-body {
    padding: 16px 20px;
  }
}

// 字段样式
.field-group {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #fafbfc;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: #f5f6f8;
  }

  &.highlight {
    background: linear-gradient(135deg, var(--mainColorLight) 0%, #f5f0ff 100%);
    border: 1px solid rgba(152, 16, 250, 0.1);
  }

  .field-icon {
    margin-right: 10px;
    font-size: 15px;
  }

  .field-label {
    color: #888;
    min-width: 65px;
    flex-shrink: 0;
    font-weight: 500;
  }

  .field-value {
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.outline-field {
    flex-direction: column;
    align-items: flex-start;

    .field-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .field-content {
      margin: 0;
      color: #444;
      line-height: 1.7;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

// 标签样式
.tags-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed #e8e8e8;

  .tag-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .tag-label {
      font-size: 12px;
      color: #888;
      min-width: 65px;
      font-weight: 500;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.custom-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;

  &.blue {
    background: #e6f4ff;
    color: #1677ff;
    border: 1px solid #91caff;
  }

  &.purple {
    background: var(--mainColorLight);
    color: var(--mainColor);
    border: 1px solid rgba(152, 16, 250, 0.3);
  }

  &.more {
    background: #f5f5f5;
    color: #999;
    border: 1px solid #e8e8e8;
  }
}

// 空状态
.empty-state {
  padding: 80px 20px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
  border: 2px dashed #e8e8e8;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    color: #999;
    font-size: 15px;
    margin-bottom: 20px;
  }

  .empty-btn {
    background: var(--mainGradient);
    border: none;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;

    &:hover {
      background: var(--mainGradientHover);
    }
  }
}

// 表单弹窗样式
.form-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;

    .section-icon {
      font-size: 16px;
    }

    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #e8e8e8 0%, transparent 100%);
      margin-left: 12px;
    }
  }
}

.chapter-selector {
  display: flex;
  align-items: center;
  gap: 14px;

  .select-btn {
    border-color: var(--mainColor);
    color: var(--mainColor);
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      background: var(--mainColorLight);
    }
  }

  .selected-text {
    color: #666;
    font-size: 13px;
  }
}

.asset-box {
  min-height: 80px;
  padding: 12px;
  background: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--mainColor);
  }

  .asset-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .asset-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    background: var(--mainColorLight);
    color: var(--mainColor);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;

    .close-icon {
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .add-asset-btn {
    border-color: #d9d9d9;
    color: #666;

    &:hover {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
}

// 表单项优化
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label > label) {
  color: #666;
  font-weight: 500;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector),
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-input-number:focus),
:deep(.ant-input-number-focused),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: var(--mainColor) !important;
  box-shadow: 0 0 0 2px rgba(152, 16, 250, 0.1) !important;
}

:deep(.ant-input:hover),
:deep(.ant-input-number:hover),
:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: var(--mainColor) !important;
}

:deep(.ant-btn-primary) {
  background: var(--mainGradient);
  border: none;

  &:hover {
    background: var(--mainGradientHover);
  }
}

:deep(.ant-modal-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;

  .ant-modal-title {
    font-weight: 600;
    font-size: 16px;
  }
}

:deep(.ant-modal-footer) {
  border-top: 1px solid #f0f0f0;
  padding: 12px 20px;
}

:deep(.ant-tag) {
  border-radius: 6px;
  padding: 2px 10px;
}

:deep(.ant-select-selection-item) {
  border-radius: 4px !important;
}
</style>
