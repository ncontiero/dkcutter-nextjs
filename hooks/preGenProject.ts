import { z } from "zod";

import { toBoolean } from "./utils/coerce";

const ctx = {
  useHusky: toBoolean("{{ useHusky }}"),
  useLintStaged: toBoolean("{{ useLintStaged }}"),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateProject({ ctx }: { ctx: any }) {
  try {
    z.object({
      useHusky: z.boolean(),
      useLintStaged: z.boolean(),
    })
      .refine(
        (data) => !(data.useLintStaged && !data.useHusky),
        "You must use husky to use lint-staged.",
      )
      .parse(ctx);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.format()._errors);
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  }
}

validateProject({ ctx });
