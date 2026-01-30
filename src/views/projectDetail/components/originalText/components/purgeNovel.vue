<template>
  <div class="purgeNovel">
    <a-modal :footer="null" :style="{ top: '20px' }" v-model:open="purgeNovelShow" title="上传小说原文" width="50%">
      <div class="data">
        <a-tabs v-model:activeKey="activeKey">
          <!-- 第一步：上传/粘贴内容 -->
          <a-tab-pane key="To1" tab="第一步">
            <div>
              <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :multiple="false"
                :maxCount="1"
                :beforeUpload="handleBeforeUpload"
                :showUploadList="true"
                action="/">
                <div style="padding-top: 42px; padding-bottom: 42px; background-color: #f9fafb">
                  <div class="dragIcon">
                    <i-upload-one theme="outline" size="32" fill="#9810fa" />
                  </div>
                  <p class="ant-upload-text">拖拽小说原文文件到此处或点击上传</p>
                  <p class="ant-upload-hint">支持 .txt, .docx 格式，建议文件大小不超过 10MB</p>
                </div>
              </a-upload-dragger>
            </div>

            <a-divider>或</a-divider>

            <div class="formItem">
              <div class="label">直接粘贴小说原文内容</div>
              <div class="uploadWrap">
                <a-textarea
                  v-model:value="content"
                  placeholder="请输入小说原文内容"
                  :auto-size="{ minRows: 18, maxRows: 18 }"
                  style="background-color: #f9fafb !important" />
              </div>
              <div class="footerInfo f ac jb" style="margin-top: 8px">
                <div>
                  <span class="charCount">{{ content.length }} 字符</span>
                  <span v-if="content.length > 0 && content.length < 100" class="tips warn">内容过短，建议至少100字符</span>
                </div>
                <span>已解析 {{ tableData.length }} 章节</span>
              </div>
            </div>

            <div style="margin-top: 16px; text-align: right">
              <a-button type="primary" style="margin-left: 10px" :disabled="!content || !tableData.length" @click="activeKey = 'To2'">
                下一步
              </a-button>
            </div>
          </a-tab-pane>

          <!-- 第二步：选择章节 -->
          <a-tab-pane key="To2" tab="第二步" force-render>
            <div>
              <vxe-table
                ref="tableRef"
                show-footer
                height="500"
                :row-config="{ isHover: true }"
                :data="tableData"
                :checkbox-config="{ highlight: true, trigger: 'row' }"
                @checkbox-change="onCheckboxChange"
                @checkbox-all="onCheckboxChange">
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column field="index" title="章" width="100"></vxe-column>
                <vxe-column field="reel" title="卷" width="100"></vxe-column>
                <vxe-column field="chapter" title="章节名称" width="200" show-header-overflow show-overflow="title" show-footer-overflow></vxe-column>
                <vxe-column field="chapterData" title="章节内容" show-header-overflow show-overflow="title" show-footer-overflow></vxe-column>
              </vxe-table>
            </div>

            <div>已勾选：{{ selectedTextLength }}字(小于200000字)</div>

            <div style="margin-top: 16px; text-align: right">
              <a-button style="margin-top: 16px" @click="activeKey = 'To1'">上一步</a-button>
              <a-button type="primary" style="margin-left: 10px" :disabled="selectedTextLength > 200000" @click="handleSubmit">保存</a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from "element-plus";
import parseNovel from "@/utils/parseNovel";
import mammoth from "mammoth";
import { message } from "ant-design-vue";

interface ChapterItem {
  index: number;
  reel: string;
  chapter: string;
  chapterData: string;
}

const purgeNovelShow = defineModel<boolean>("modelValue");
const emit = defineEmits<{ select: [chapters: ChapterItem[]] }>();

const activeKey = ref("To1");
const tableRef = ref();
const content = ref("");
const fileList = ref<any[]>([]);
const selectedRows = ref<ChapterItem[]>([]);

// 解析后的章节数据
const tableData = computed<ChapterItem[]>(() => {
  if (!content.value) return [];
  try {
    return parseNovel(content.value).flatMap((reel) =>
      reel.chapters.map((chapter) => ({
        index: chapter.index,
        reel: reel.reel,
        chapter: chapter.chapter,
        chapterData: chapter.text,
      })),
    );
  } catch (e) {
    console.error("解析小说内容出错:", e);
    return [];
  }
});

// 已选文本总长度
const selectedTextLength = computed(() => selectedRows.value.reduce((sum, item) => sum + item.chapterData.length, 0));

// 读取文件内容
async function readFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  if (file.type === "text/plain") {
    return new TextDecoder().decode(buffer);
  }
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

// 上传前校验并解析
async function handleBeforeUpload(file: File) {
  const allowTypes = ["text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  if (file.type === "application/msword") {
    message.warning(".doc文件不支持解析，请转换为.txt或.docx文件");
    return false;
  }
  if (!allowTypes.includes(file.type)) {
    message.error("不支持的文件类型");
    return false;
  }
  if (file.size > 10 * 1024 * 1024) {
    message.error("文件大小超过10MB，请上传更小的文件");
    return false;
  }

  const loading = ElLoading.service({ lock: true, text: "文件解析中...", background: "rgba(0,0,0,0.7)" });
  try {
    content.value = await readFile(file);
  } catch {
    message.error("文件解析失败，请重新上传");
  } finally {
    loading.close();
  }
  return false;
}

// 勾选变化
function onCheckboxChange({ records }: { records: ChapterItem[] }) {
  selectedRows.value = records;
}

// 提交
function handleSubmit() {
  if (!selectedRows.value.length) {
    message.warning("请先勾选章节");
    return;
  }
  emit("select", selectedRows.value);
}
</script>

<style lang="scss" scoped></style>
