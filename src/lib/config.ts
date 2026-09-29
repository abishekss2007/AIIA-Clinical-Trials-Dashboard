export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'AyurCTMS';
export const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'development';
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const isLocalDev = appEnv === 'development';
