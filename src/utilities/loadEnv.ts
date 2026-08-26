import { config as loadEnv } from "dotenv";
import path from "node:path";

/**
 * Load environment variables from `.env.local` and `.env`.
 *
 * `.env.local` is loaded first so that its values take precedence over values
 * defined in `.env`. Existing environment variables are not overwritten by
 * subsequent files.
 *
 * @param root - The project root containing the environment files.
 */
export function loadEnvironment(root = process.cwd()) {
  loadEnv({
    path: [path.resolve(root, ".env.local"), path.resolve(root, ".env")],
    quiet: true,
  });
}
