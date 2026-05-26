import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  ignores: ["template"],
  nextjs: false,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
