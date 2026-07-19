import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  ignores: ["template"],
  nextjs: false,
  typescript: {
    typeAware: true,
  },
  unicorn: {
    overrides: {
      "unicorn/prefer-simple-condition-first": "off",
    },
  },
});
