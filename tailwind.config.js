// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["Archivo Black", "sans-serif"],
        sans: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
      },
      boxShadow: {
        xs: "1px 1px 0 0 var(--border)",
        sm: "2px 2px 0 0 var(--border)",
        DEFAULT: "3px 3px 0 0 var(--border)",
        md: "4px 4px 0 0 var(--border)",
        lg: "6px 6px 0 0 var(--border)",
        xl: "10px 10px 0 1px var(--border)",
        "2xl": "16px 16px 0 1px var(--border)",
      },
    },
  },
  plugins: [],
};
