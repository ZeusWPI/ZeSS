import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      quotes: "double",
      semi: true,
    },

    react: true,

    typescript: {
      tsconfigPath: "./tsconfig.json",
    },

    formatters: true,

    rules: {
      "react-hooks/exhaustive-deps": "off",
      "ts/switch-exhaustiveness-check": "off",
      "ts/strict-boolean-expressions": "off",
    },
  },
);
