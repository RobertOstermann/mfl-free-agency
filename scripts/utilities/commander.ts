import chalk from "chalk";

/** Shared `configureHelp` styling options for all script CLIs using `commander`. */
export const helpConfig = {
  helpWidth: process.stdout.columns,
  styleTitle: (title: string) => chalk.bold(title),
  styleCommandText: (text: string) => chalk.bold(text),
  styleOptionTerm: (term: string) => chalk.cyan(term),
  styleSubcommandTerm: (term: string) => chalk.cyan(term),
  styleArgumentTerm: (term: string) => chalk.cyan(term),
  styleDescriptionText: (text: string) => chalk.gray(text),
};
