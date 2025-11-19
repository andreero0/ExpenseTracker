#!/usr/bin/env node

/**
 * App Scaffold CLI
 * Creates new React Native apps with a modern, production-ready tech stack
 */

import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { runPrompts } from './prompts.js';
import { setupProject } from './setup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Package version
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
);

console.log(chalk.bold.cyan('\n🚀 App Scaffold CLI\n'));

program
  .name('create-app-scaffold')
  .description('Create a new React Native app with modern tech stack')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of your new project')
  .option('-t, --template <template>', 'Template to use (default: full)')
  .option('--skip-install', 'Skip installing dependencies')
  .option('--skip-git', 'Skip git initialization')
  .action(async (projectName, options) => {
    try {
      console.log(chalk.dim('Creating your new app...\n'));

      // Get project configuration from prompts
      const config = await runPrompts(projectName, options);

      // Set up the project
      await setupProject(config, options);

      // Success message
      console.log(chalk.green.bold('\n✨ Success! Your app is ready!\n'));
      console.log(chalk.cyan('Next steps:\n'));
      console.log(chalk.white(`  cd ${config.projectName}`));
      console.log(chalk.white('  npm run dev\n'));
      console.log(chalk.dim('Happy coding! 🎉\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ Error creating app:'), error.message);
      process.exit(1);
    }
  });

program.parse();
