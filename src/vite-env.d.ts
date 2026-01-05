/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER?: 'openai' | 'gemini'
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
