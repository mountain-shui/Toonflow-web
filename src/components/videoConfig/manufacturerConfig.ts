// 图片项
export interface ImageItem {
  id: number;
  filePath: string;
  prompt: string;
}

// 视频配置
export interface VideoConfigData {
  id: number;
  manufacturer: string;
  mode: "startEnd" | "multi" | "single";
  startFrame: ImageItem | null;
  endFrame: ImageItem | null;
  images: ImageItem[];
  resolution: string;
  duration: number;
  prompt: string;
  promptLoading?: boolean;
}

// 厂商配置定义
export interface ManufacturerConfig {
  label: string;
  value: string;
  modes: { label: string; value: string }[];
  defaultMode: string;
  resolutions: { label: string; value: string }[];
  defaultResolution: string;
  resolutionLabel: string;
  durationOptions?: { label: string; value: number }[];
  durationRange?: { min: number; max: number; step: number };
  durationTip?: string;
  maxImages: number;
}

// 厂商配置
export const manufacturerConfigs: Record<string, ManufacturerConfig> = {
  volcengine: {
    label: "火山引擎(豆包)",
    value: "volcengine",
    modes: [{ label: "首尾帧", value: "startEnd" }],
    defaultMode: "startEnd",
    resolutions: [
      { label: "480p", value: "480p" },
      { label: "720p", value: "720p" },
      { label: "1080p", value: "1080p" },
    ],
    defaultResolution: "720p",
    resolutionLabel: "分辨率",
    durationRange: { min: 4, max: 12, step: 1 },
    durationTip: "4-12秒",
    maxImages: 2,
  },
  runninghub: {
    label: "RunningHub(Sora)",
    value: "runninghub",
    modes: [{ label: "多图模式", value: "multi" }],
    defaultMode: "multi",
    resolutions: [
      { label: "16:9 横屏", value: "16:9" },
      { label: "9:16 竖屏", value: "9:16" },
    ],
    defaultResolution: "16:9",
    resolutionLabel: "画面比例",
    durationOptions: [
      { label: "10秒", value: 10 },
      { label: "15秒", value: 15 },
    ],
    maxImages: 4,
  },
  apimart: {
    label: "Apimart(Sora)",
    value: "apimart",
    modes: [{ label: "多图模式", value: "multi" }],
    defaultMode: "multi",
    resolutions: [
      { label: "16:9 横屏", value: "16:9" },
      { label: "9:16 竖屏", value: "9:16" },
    ],
    defaultResolution: "16:9",
    resolutionLabel: "画面比例",
    durationOptions: [
      { label: "10秒", value: 10 },
      { label: "15秒", value: 15 },
    ],
    maxImages: 4,
  },
};

// 厂商标签映射
export const manufacturerLabels: Record<string, string> = {
  volcengine: "火山引擎(豆包)",
  runninghub: "RunningHub(Sora)",
  openAi: "OpenAI(Sora)",
};

// 模式标签映射
export const modeLabels: Record<string, string> = {
  startEnd: "首尾帧模式",
  multi: "多图模式",
  single: "单图模式",
};

// 获取厂商配置
export function getManufacturerConfig(manufacturer: string): ManufacturerConfig {
  return manufacturerConfigs[manufacturer] || manufacturerConfigs.volcengine;
}

// 获取厂商标签
export function getManufacturerLabel(manufacturer: string): string {
  return manufacturerLabels[manufacturer] || manufacturer;
}

// 获取模式标签
export function getModeLabel(mode: string): string {
  return modeLabels[mode] || mode;
}

// 获取模式选项
export function getModeOptions(manufacturer: string) {
  return getManufacturerConfig(manufacturer).modes;
}

// 获取分辨率标签
export function getResolutionLabel(manufacturer: string): string {
  return getManufacturerConfig(manufacturer).resolutionLabel;
}

// 获取分辨率选项
export function getResolutionOptions(manufacturer: string) {
  return getManufacturerConfig(manufacturer).resolutions;
}

// 获取默认分辨率
export function getDefaultResolution(manufacturer: string): string {
  return getManufacturerConfig(manufacturer).defaultResolution;
}

// 获取默认模式
export function getDefaultMode(manufacturer: string): string {
  return getManufacturerConfig(manufacturer).defaultMode;
}

// 获取默认时长
export function getDefaultDuration(manufacturer: string): number {
  const config = getManufacturerConfig(manufacturer);
  if (config.durationOptions && config.durationOptions.length > 0) {
    return config.durationOptions[0].value;
  }
  return config.durationRange?.min || 5;
}

// 获取时长选项
export function getDurationOptions(manufacturer: string) {
  return getManufacturerConfig(manufacturer).durationOptions || [];
}

// 获取时长范围
export function getDurationRange(manufacturer: string) {
  return getManufacturerConfig(manufacturer).durationRange || { min: 5, max: 20, step: 1 };
}

// 获取时长提示
export function getDurationTip(manufacturer: string): string {
  return getManufacturerConfig(manufacturer).durationTip || "";
}

// 获取最大图片数
export function getMaxImages(manufacturer: string): number {
  return getManufacturerConfig(manufacturer).maxImages;
}

// 创建默认配置
export function createDefaultConfig(manufacturer: string, id: number): VideoConfigData {
  return {
    id,
    manufacturer,
    mode: getDefaultMode(manufacturer) as VideoConfigData["mode"],
    startFrame: null,
    endFrame: null,
    images: [],
    resolution: getDefaultResolution(manufacturer),
    duration: getDefaultDuration(manufacturer),
    prompt: "",
    promptLoading: false,
  };
}
