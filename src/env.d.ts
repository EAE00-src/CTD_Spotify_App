/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SPOTIFY_CL_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}