/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PORT: number;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_BASE_API_URL: string;
  readonly VITE_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
