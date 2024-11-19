/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用名称
  readonly VITE_APP_TITLE: string
  // 接口地址，仅开发环境下有效
  readonly VITE_API_HOST: string
  // 七牛云域名
  readonly VITE_QINIU_DOMAIN: string
  // 应用基础路径
  readonly VITE_APP_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
