import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-cn',
  title: 'easy-largescreen',
  description: 'A VitePress Site',

  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '开发笔记', link: '/dev-note/designer', activeMatch: '^/dev-note/designer/' },
    ],

    outline: {
      label: '本页目录',
    },

    sidebar: {
      '/dev-note': [
        {
          text: '可视化编辑器',
          collapsed: true,
          items: [
            { text: '拖拽物料至画布', link: '/dev-note/designer/add-widget-by-drag' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/whitexie/easy-largescreen' },
    ],

    search: {
      provider: 'local',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdatedText: '最后更新时间',

  },
})
