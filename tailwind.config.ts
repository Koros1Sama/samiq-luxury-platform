import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/themes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/core/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#070709",
          dark: "#040405",
          light: "#0D0D12",
        },
        surface: {
          DEFAULT: "#0E0E12",
          elevated: "#15151B",
          subtle: "#1B1B24",
        },
        gold: {
          DEFAULT: "#C9A84C",
          metallic: "#BF953F",
          light: "#FCF6BA",
          dark: "#B38728",
          champagne: "#E6CFA0",
          deep: "#8A7326",
          halo: "rgba(201, 168, 76, 0.25)",
        },
        ivory: {
          DEFAULT: "#F5F2EB",
          muted: "#D6D1C5",
        },
        muted: {
          lux: "#9A968E",
          dim: "#6B6760",
        },
      },
      fontFamily: {
        serif: ["var(--font-amiri)", "Georgia", "serif"],
        sans: ["var(--font-ibm-plex-arabic)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        architectural: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        fadeIn: "fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      boxShadow: {
        "gold-glow": "0 0 35px -5px rgba(201, 168, 76, 0.25)",
        "gold-halo": "0 10px 30px -10px rgba(201, 168, 76, 0.4)",
        "double-bezel": "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0,0,0,0.8)",
        "editorial-soft": "0 18px 45px -20px rgba(27, 22, 18, 0.14)",
        "clinical-card": "0 1px 3px rgba(15, 76, 74, 0.05), 0 12px 28px -12px rgba(15, 76, 74, 0.09)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)",
        "gold-radial": "radial-gradient(circle at center, rgba(201, 168, 76, 0.15) 0%, transparent 70%)",
        "dark-radial": "radial-gradient(circle at 50% 0%, #15151B 0%, #070709 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
