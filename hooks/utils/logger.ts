/* eslint-disable no-console */
import util from "node:util";
import { isMainThread, parentPort } from "node:worker_threads";
import { blue, green, red, yellow } from "colorette";

type LOG_TYPE = "info" | "success" | "error" | "warn";

const toLogString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  )
    return String(value);

  try {
    // Try JSON first for objects/arrays to preserve structure
    return JSON.stringify(value);
  } catch {
    // Fallback to default string conversion
    return String(value);
  }
};

export const colorize = (type: LOG_TYPE, data: unknown) => {
  const text = toLogString(data);
  switch (type) {
    case "info":
      return blue(text);
    case "warn":
      return yellow(text);
    case "success":
      return green(text);
    case "error":
      return red(text);
    default:
      return text;
  }
};

export function createLogger(type: LOG_TYPE, ...data: unknown[]) {
  const args = data.map((item) => colorize(type, item));
  switch (type) {
    case "error": {
      if (!isMainThread) {
        parentPort?.postMessage({
          type: "error",
          text: util.format(...args),
        });
        return;
      }

      return console.error(...args);
    }
    default:
      if (!isMainThread) {
        parentPort?.postMessage({
          type: "log",
          text: util.format(...args),
        });
        return;
      }

      console.log(...args);
  }
}

export const logger = {
  error: (...args: unknown[]) => {
    return createLogger("error", ...args);
  },
  warn: (...args: unknown[]) => {
    return createLogger("warn", ...args);
  },
  info: (...args: unknown[]) => {
    return createLogger("info", ...args);
  },
  success: (...args: unknown[]) => {
    return createLogger("success", ...args);
  },
  break: () => console.log(""),
};
