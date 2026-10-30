const v = (n) => `rgb(var(--c-${n}) / <alpha-value>)`;
const names = ["surface","surface-bright","surface-container-lowest","surface-container-low","surface-container","surface-container-high","surface-container-highest","surface-variant","on-surface","on-surface-variant","outline","outline-variant","primary","on-primary","primary-fixed-dim","secondary","secondary-fixed","secondary-container","on-secondary-container","on-secondary","tertiary-fixed-dim","error","error-container","py","cpp","java","ai","heat0","heat1","heat2","heat3","heat3t"];
const colors = {};
names.forEach((n) => (colors[n] = v(n)));
colors.background = v("surface");
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      borderRadius: { DEFAULT: "0.125rem", lg: "0.25rem", xl: "0.5rem", full: "0.75rem" },
      spacing: { "space-sm": "0.375rem", "space-md": "0.75rem", "space-lg": "1rem", "gutter-desktop": "1rem", margin: "1rem", "space-xs": "0.25rem", "space-xl": "1.5rem", gutter: "0.75rem", "margin-desktop": "1.5rem" },
      fontFamily: Object.fromEntries(["headline-lg","headline-lg-mobile","display-numeral","headline-sm","label-sm","label-md","body-sm","headline-md","code-stat","body-md"].map((k) => [k, ["Archivo Narrow", "system-ui", "sans-serif"]])),
      fontSize: {
        "headline-lg": ["2rem", { lineHeight: "2.25rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["1.5rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-numeral": ["3rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-sm": ["1rem", { lineHeight: "1.25rem", fontWeight: "600" }],
        "label-sm": ["0.6875rem", { lineHeight: "0.875rem", fontWeight: "500" }],
        "label-md": ["0.8125rem", { lineHeight: "1rem", fontWeight: "600" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.125rem", fontWeight: "400" }],
        "headline-md": ["1.25rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        "code-stat": ["0.875rem", { lineHeight: "1rem", fontWeight: "600" }],
        "body-md": ["0.9375rem", { lineHeight: "1.375rem", fontWeight: "400" }]
      }
    }
  }
};
