import { z } from "zod";

import { toBoolean } from "./utils/coerce";

const ctx = {
  useHusky: toBoolean("{{ dkcutter.useHusky }}"),
  useLintStaged: toBoolean("{{ dkcutter.useLintStaged }}"),
};

// Removing cmd `run` when the package manager is `yarn` or `pnpm`.
// {% if ['pnpm', 'yarn'].includes(dkcutter.pkgManager) %}
// {{ dkcutter.update('_lintScript', dkcutter._lintScript|replace('run ', '')) }}
// {{ dkcutter.update('_preCommit', dkcutter._preCommit|replace('run ', '')) }}
// {{ dkcutter.update('_commitMsg', dkcutter._commitMsg|replace('run ', '')) }}
// {% endif %}

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
    if (error instanceof z.ZodError) {
      console.error(error.format()._errors);
      process.exit(1);
    }
    console.error(error);
    process.exit(1);
  }
}

validateProject({ ctx });
