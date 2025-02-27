import { z } from "zod";

import { toBoolean } from "./utils/coerce";
import { logger } from "./utils/logger";

const ctx = {
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
};

export function validateProject({ ctx }: { ctx: unknown }) {
  try {
    z.object({
      useHusky: z.boolean(),
      useLintStaged: z.boolean(),
    })
      .refine(
        (data) => !data.useLintStaged || data.useHusky,
        "You must use husky to use lint-staged.",
      )
      .parse(ctx);
  } catch (error) {
    logger.break();
    if (error instanceof z.ZodError) {
      logger.error(error.format()._errors.join(",").replaceAll(",", "\n"));
    } else {
      logger.error(error);
    }
    process.exit(1);
  }
}

validateProject({ ctx });
