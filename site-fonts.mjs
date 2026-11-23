/**
 * Site font registration — 集集電
 * 主字體 Noto Sans TC：建置時自 Google 下載並自架（400／600）
 * 等寬：JetBrains Mono 本地
 */
import { fontProviders } from "astro/config";

export const siteFonts = [
  {
    name: "Noto Sans TC",
    cssVariable: "--font-noto-sans-tc",
    provider: fontProviders.google(),
    weights: [400, 600],
    styles: ["normal"],
    subsets: ["latin", "chinese-traditional"],
    fallbacks: ["PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "sans-serif"],
  },
  {
    name: "JetBrains Mono",
    cssVariable: "--font-mono-face",
    provider: fontProviders.local(),
    options: {
      variants: [
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-regular.woff2"],
          weight: "400",
          style: "normal",
        },
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-600.woff2"],
          weight: "600",
          style: "normal",
        },
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-700.woff2"],
          weight: "700",
          style: "normal",
        },
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-italic.woff2"],
          weight: "400",
          style: "italic",
        },
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-600italic.woff2"],
          weight: "600",
          style: "italic",
        },
        {
          src: ["./public/fonts/JetBrains Mono/jetbrains-mono-v24-latin-700italic.woff2"],
          weight: "700",
          style: "italic",
        },
      ],
    },
  },
];
