import { logger } from "./logger";

export function handleError(error: unknown) {
  logger.error("Test failed!");

  if (typeof error === "string") {
    logger.error(error);
  } else if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error("Something went wrong.");
  }

  process.exit(1);
}
