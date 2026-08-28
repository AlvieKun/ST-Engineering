import type { Config } from 'tailwindcss';
export default { content: ['./src/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#151515', paper: '#f5f4ef', signal: '#d95d39', moss: '#49634b' }, fontFamily: { sans: ['Arial', 'sans-serif'], mono: ['ui-monospace', 'SFMono-Regular', 'monospace'] } } }, plugins: [] } satisfies Config;
