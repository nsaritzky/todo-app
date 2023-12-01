import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bright-blue": "hsl(220, 98%, 61%)",
        "grad-start": "hsl(192, 100%, 67%)",
        "grad-end": "hsl(280, 87%, 65%)",

        "very-light-gray": "hsl(0, 0%, 98%)",
        "very-light-grayish-blue": "hsl(236, 33%, 92%)",
        "light-grayish-blue": "hsl(233, 11%, 84%)",
        "dark-grayish-blue-light": "hsl(236, 9%, 61%)",
        "very-dark-grayish-blue-light": "hsl(235, 19%, 35%)",

        "very-dark-blue": "hsl(235, 21%, 11%)",
        "very-dark-desaturated-blue": "hsl(235, 24%, 19%)",
        "light-grayish-blue": "hsl(234, 39%, 85%)",
        "light-grayish-blue-hover": "hsl(236, 33%, 92%)",
        "dark-grayish-blue": "hsl(234, 11%, 52%)",
        "very-dark-grayish-blue": "hsl(233, 14%, 35%)",
        "very-dark-grayer-blue": "hsl(237, 14%, 26%)",
      },
      fontFamily: {
        "josefin-sans": ["Josefin Sans", "sans-serif"],
      },
      backgroundImage: {
        "desktop-light": "url('/images/bg-desktop-light.jpg')",
        "desktop-dark": "url('/images/bg-desktop-dark.jpg')",
        "mobile-light": "url('/images/bg-mobile-light.jpg')",
        "mobile-dark": "url('/images/bg-mobile-dark.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
