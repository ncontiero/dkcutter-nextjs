import { z } from "zod";

const ctx = {
  projectSlug: "{{ projectSlug }}",
  useHusky: "{{ useHusky }}" === "true",
  useLintStaged: "{{ useLintStaged }}" === "true",
};

export function validateProject({ ctx }) {
  try {
    z.object({
      projectSlug: z
        .string()
        .regex(/^[a-z0-9@][a-z0-9-_]*$/, "Invalid project slug."),
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
