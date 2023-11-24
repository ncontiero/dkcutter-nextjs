import util from "node:util";
import { parentPort, isMainThread } from "node:worker_threads";
import { blue, yellow, green, red } from "colorette";

export const colorize = (type, data) => {
  switch (type) {
    case "info":
      return blue(data);
    case "warn":
      return yellow(data);
    case "success":
      return green(data);
    case "error":
      return red(data);
    default:
      return data;
  }
};

export function createLogger(type, ...data) {
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
  error: (...args) => {
    return createLogger("error", ...args);
  },
  warn: (...args) => {
    return createLogger("warn", ...args);
  },
  info: (...args) => {
    return createLogger("info", ...args);
  },
  success: (...args) => {
    return createLogger("success", ...args);
  },
  break: () => console.log(""),
};
