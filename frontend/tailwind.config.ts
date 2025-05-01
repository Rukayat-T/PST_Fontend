import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPurple: "#5C0061",
        lightPurple: {
          DEFAULT: "#C793C5",
          30: "rgba(199, 147, 197, 0.30)",
          20: "rgba(199, 147, 197, 0.20)",
        },
        lime: "#32CD32",
        greyOutline: "#AEABAB",
        black: "#000000",
        white: "#FFFFFF",
      },
      fontFamily: {
        figtree: "figtree",
      },
    },
  },
  plugins: [],
};
export default config;
