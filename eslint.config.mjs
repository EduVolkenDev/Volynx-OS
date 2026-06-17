import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [
      ".next/**",
      "dist/**",
      "out/**",
      "node_modules/**",
      "storage/propertyflow/_archive/**",
      "storage/propertyflow/*.zip",
    ],
  },
  {
    settings: {
      react: {
        version: "18.3.1",
      },
    },
    rules: {
      "react/display-name": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-location-assign-relative-destination": "off",
    },
  },
];

export default eslintConfig;
