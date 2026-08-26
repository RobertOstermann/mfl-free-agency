/**
 * This script runs the same commands as the [🚧 Code
 * Quality](../.github/workflows/pull_request_checks.yml) GitHub Action. The
 * commands are run in parallel and you can output the logs of the failed
 * commands at the end.
 *
 * Usage: npm run checks
 *
 * Options:
 *
 * - -v, --verbose: Display the output of all commands
 * - -f, --fix: Automatically fix issues when possible
 * - -h, --help: Display this help message
 */

import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { spawn } from "child_process";
import cliSpinners from "cli-spinners";
import { Command } from "commander";
import * as readline from "readline";
import { helpConfig } from "./utilities/commander";

/** The status of a command execution. */
type Status = "LOADING" | "PASSED" | "WARNING" | "FAILED";

/** The details for the individual commands. */
type CommandDetails = {
  name: string;
  cmd: string;
  env?: Partial<NodeJS.ProcessEnv>;
};

/** The result of the individual commands. */
type CommandResult = {
  status: Status;
  output?: string;
} & CommandDetails;

/** The status of the individual commands. */
type StatusMessage = {
  status: Status;
  message: string;
};

const program = new Command()
  .name("code-checks")
  .configureHelp(helpConfig)
  .description(
    "Runs the same commands as the 🚧 Code Quality GitHub Action " +
      "(.github/workflows/pull_request_checks.yml) in parallel, with the " +
      "option to view the logs of any failed commands at the end.",
  )
  .option("-v, --verbose", "display the output of all commands", false)
  .option("-f, --fix", "automatically fix issues when possible", false)
  .addHelpText(
    "after",
    `\n${chalk.bold("Checks:")}\n` +
      "  TypeScript, ESLint, Expo Doctor, Audit " +
      chalk.dim("(commands adjust automatically with --fix)"),
  )
  .parse();

const options = program.opts<{ verbose: boolean; fix: boolean }>();
const isVerbose = options.verbose;
const shouldFix = options.fix;

const STATUS_SYMBOLS: Record<Status, string> = {
  LOADING: "",
  PASSED: chalk.green("✅"),
  FAILED: chalk.red("❌"),
  WARNING: chalk.yellow("🟠"),
};

/**
 * The commands to run. This should match the [🚧 Code
 * Quality](../.github/workflows/pull_request_checks.yml) GitHub Action.
 */
const commands: CommandDetails[] = [
  { name: "TypeScript", cmd: "npm run ts:check" },
  {
    name: "ESLint",
    cmd: shouldFix ? "npm run fix" : "npm run lint",
  },
  {
    name: "Translations",
    cmd: shouldFix
      ? "npm run codegen:translations"
      : "npm run validate:translations",
  },
  { name: "Expo Doctor", cmd: "npm run expo:doctor" },
  {
    name: "Audit",
    cmd: shouldFix ? "npm audit fix" : "npm run audit",
    env: {
      IGNORED_VULNERABILITIES: "GHSA-w3rx-r6r6-pgpr,GHSA-5p2g-fcmc-qvqq",
    },
  },
];

const spinnerFrames: string[] = cliSpinners.dots.frames;
const spinnerInterval: number = cliSpinners.dots.interval;
let spinnerIndex = 0;

const commandCount = commands.length;
let hasRendered = false;

/** Renders the spinner and status messages for all commands. */
function renderSpinners(statuses: Record<string, StatusMessage>): void {
  if (hasRendered) {
    // Move cursor up to overwrite previous render
    readline.moveCursor(process.stdout, 0, -commandCount);
  }

  for (const key in statuses) {
    const { status, message } = statuses[key] ?? {
      status: "LOADING",
      message: "Something went wrong",
    };

    const spinner =
      status === "LOADING"
        ? chalk.cyan(spinnerFrames[spinnerIndex] ?? "")
        : STATUS_SYMBOLS[status];

    readline.clearLine(process.stdout, 0);
    console.log(`${spinner} ${chalk.bold(key)} ${chalk.dim(message)}`);
  }

  hasRendered = true;
}

/** Updates the status message for a command. */
function updateStatusMessage(
  statuses: Record<string, StatusMessage>,
  name: string,
  status: Status,
  startTime: number,
): void {
  const totalDuration = (performance.now() - startTime) / 1000;
  const duration = totalDuration.toFixed(2);
  statuses[name] = {
    status,
    message: `Ran in ${duration}s`,
  };
}

/** Runs a command and returns its result. */
async function runCommand(
  command: CommandDetails,
  statuses: Record<string, StatusMessage>,
  startTime: number,
): Promise<CommandResult> {
  const [cmd, ...args] = command.cmd.split(" ");

  if (!cmd) {
    throw new Error(`Invalid command: ${command.cmd}`);
  }

  return new Promise<CommandResult>((resolve) => {
    const proc = spawn(cmd, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, ...command.env, FORCE_COLOR: "1" },
    });
    let output = "";

    proc.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("close", (code: number | null) => {
      const hasWarnings = /warn/i.test(output);
      const processResult: Status =
        code === 0 ? (hasWarnings ? "WARNING" : "PASSED") : "FAILED";

      updateStatusMessage(statuses, command.name, processResult, startTime);

      resolve({ ...command, status: processResult, output });
    });

    proc.on("error", (error: Error) => {
      updateStatusMessage(statuses, command.name, "FAILED", startTime);
      resolve({
        ...command,
        status: "FAILED",
        output: `Process error: ${error.message}`,
      });
    });
  });
}

/** Prints a summary of results. */
function printSummary(results: CommandResult[], startTime: number): void {
  const passed = results.filter((r) => r.status === "PASSED").length;
  const warnings = results.filter((r) => r.status === "WARNING").length;
  const failed = results.filter((r) => r.status === "FAILED").length;

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(
    chalk.bold(
      `\nSummary: ${chalk.green(`${passed} Passed`)} | ${chalk.yellow(
        `${warnings} Warnings`,
      )} | ${chalk.red(`${failed} Failed`)} | ${chalk.dim(`Total time: ${totalTime}s`)}\n`,
    ),
  );
}

/** Main execution function. */
async function main(): Promise<void> {
  const statuses: Record<string, StatusMessage> = {};
  const startTime = performance.now();

  for (const command of commands) {
    statuses[command.name] = {
      status: "LOADING",
      message: `Running...`,
    };
  }

  const interval = setInterval(() => {
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
    renderSpinners(statuses);
  }, spinnerInterval);

  const results = await Promise.all(
    commands.map((cmd) => runCommand(cmd, statuses, startTime)),
  );

  clearInterval(interval);
  renderSpinners(statuses);
  printSummary(results, startTime);

  const failedCommands = results.filter((result) => result.status === "FAILED");
  const cautionCommands = results.filter(
    (result) => result.status === "WARNING",
  );
  const logCommands = results.filter(
    (result) => result.status === "FAILED" || result.status === "WARNING",
  );

  if (
    !isVerbose &&
    failedCommands.length === 0 &&
    cautionCommands.length === 0
  ) {
    console.log(chalk.bold(chalk.green("\nCode checks passed!")));
    return;
  } else if (!isVerbose) {
    console.log();
  }

  const message =
    failedCommands.length > 0
      ? "Some checks failed. Display verbose (-v) output?"
      : "Some checks have warnings. Display verbose (-v) output?";

  const showLogs =
    isVerbose ||
    (await confirm({
      message,
      default: true,
    }));

  if (showLogs) {
    const output = isVerbose ? results : logCommands;

    const separator = chalk.dim("─".repeat(process.stdout.columns ?? 80));
    console.log();
    console.log(separator);

    output.forEach((result) => {
      let headerColor: (text: string) => string;
      if (result.status === "FAILED") {
        headerColor = chalk.red;
      } else if (result.status === "WARNING") {
        headerColor = chalk.yellow;
      } else {
        headerColor = chalk.green;
      }

      console.log(
        `\n${chalk.bold(headerColor("👇 " + result.cmd))} (${chalk.bold(result.name)})`,
      );

      if (result.output) {
        process.stdout.write(result.output);
      } else {
        console.log(chalk.dim("No output available."));
      }

      console.log();
      console.log(separator);
    });
  }
}

main().catch((err: unknown) => {
  console.error(chalk.red("Something went wrong running code-checks"), err);
  process.exit(1);
});
