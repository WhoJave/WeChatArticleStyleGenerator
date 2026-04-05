import { ref } from 'vue'

export const FONTS = [
  { id: 'system',   name: '系统默认', family: "'PingFang SC','Microsoft YaHei',sans-serif",   preview: '秋日私语' },
  { id: 'noto-sans', name: '思源黑体', family: "'Noto Sans SC', 'PingFang SC', sans-serif",    preview: '秋日私语' },
  { id: 'noto-serif',name: '思源宋体', family: "'Noto Serif SC', 'SimSun', serif",              preview: '秋日私語' },
  { id: 'xiaowei',  name: '小微字体', family: "'ZCOOL XiaoWei', 'PingFang SC', sans-serif",   preview: '秋日私语' },
  { id: 'mashan',   name: '马善政楷体', family: "'Ma Shan Zheng', 'STKaiti', cursive",           preview: '秋日私語' },
  { id: 'qingke',   name: '青柯黄游', family: "'ZCOOL QingKe HuangYou', cursive",             preview: '秋日私语' },
  { id: 'zhimang',  name: '钟芒行书', family: "'Zhi Mang Xing', cursive",                      preview: '秋日私語' },
  { id: 'liujian',  name: '流江毛草', family: "'Liu Jian Mao Cao', cursive",                   preview: '秋日私語' },
  { id: 'yidianyan',name: '一点颜体', family: "'I.Ngaan', cursive",                            preview: '秋日私語' },
  { id: 'yrdzst',   name: '杨任东竹石体', family: "'YRDZST', sans-serif",                        preview: '秋日私语' },
]

const currentFontId = ref('noto-sans')

export function useFont() {
  function setFont(id) {
    currentFontId.value = id
  }

  function getCurrentFont() {
    return FONTS.find(f => f.id === currentFontId.value) || FONTS[0]
  }

  return {
    FONTS,
    currentFontId,
    setFont,
    getCurrentFont,
  }
}
