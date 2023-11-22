import chalk from "chalk";

export function createLogger(color) {
  return (...args) => console.log(color(args.toString()));
}

export const logger = {
  error: createLogger(chalk.red),
  warn: createLogger(chalk.yellow),
  info: createLogger(chalk.cyan),
  success: createLogger(chalk.green),
  break: () => console.log(""),
};
