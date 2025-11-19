/**
 * Interactive Prompts
 * Asks user for project configuration
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import validateNpmPackageName from 'validate-npm-package-name';
import path from 'path';
import fs from 'fs-extra';

/**
 * Validate project name
 */
function validateProjectName(name) {
  const validation = validateNpmPackageName(name);

  if (!validation.validForNewPackages) {
    const errors = [
      ...(validation.errors || []),
      ...(validation.warnings || []),
    ];
    return `Invalid project name: ${errors.join(', ')}`;
  }

  // Check if directory already exists
  const projectPath = path.resolve(process.cwd(), name);
  if (fs.existsSync(projectPath)) {
    return `Directory "${name}" already exists. Please choose a different name.`;
  }

  return true;
}

/**
 * Validate package identifier (com.company.app)
 */
function validatePackageId(id) {
  const regex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
  if (!regex.test(id)) {
    return 'Invalid package identifier. Example: com.yourcompany.appname';
  }
  return true;
}

/**
 * Run interactive prompts
 */
export async function runPrompts(projectName, options) {
  const questions = [];

  // Project name
  if (!projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-app',
      validate: validateProjectName,
    });
  }

  // App display name
  questions.push({
    type: 'input',
    name: 'appName',
    message: 'What is your app display name?',
    default: (answers) =>
      (projectName || answers.projectName)
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
  });

  // Package identifier
  questions.push({
    type: 'input',
    name: 'packageId',
    message: 'Package identifier (com.company.app):',
    default: (answers) => {
      const name = projectName || answers.projectName;
      return `com.yourcompany.${name.replace(/-/g, '')}`;
    },
    validate: validatePackageId,
  });

  // Theme selection
  questions.push({
    type: 'list',
    name: 'theme',
    message: 'Select a color theme:',
    choices: [
      { name: '🌊 Ocean (Blue)', value: 'ocean' },
      { name: '🌲 Forest (Green)', value: 'forest' },
      { name: '🍇 Purple', value: 'purple' },
      { name: '☕ Coffee (Brown)', value: 'coffee' },
      { name: '🎨 Custom (you configure later)', value: 'custom' },
    ],
    default: 'ocean',
  });

  // Features
  questions.push({
    type: 'checkbox',
    name: 'features',
    message: 'Select features to include:',
    choices: [
      {
        name: '🔐 Authentication (Supabase + Biometrics)',
        value: 'auth',
        checked: true,
      },
      {
        name: '👋 Onboarding flow',
        value: 'onboarding',
        checked: true,
      },
      {
        name: '👤 Profile management',
        value: 'profile',
        checked: true,
      },
      {
        name: '📸 Camera & image upload',
        value: 'camera',
        checked: false,
      },
      {
        name: '🔔 Push notifications',
        value: 'notifications',
        checked: true,
      },
      {
        name: '🤖 AI features (OpenAI integration)',
        value: 'ai',
        checked: false,
      },
      {
        name: '📊 Example CRUD screens',
        value: 'examples',
        checked: true,
      },
    ],
  });

  // Include backend
  questions.push({
    type: 'confirm',
    name: 'includeBackend',
    message: 'Include FastAPI backend?',
    default: true,
  });

  // Run prompts
  const answers = await inquirer.prompt(questions);

  // Combine with provided projectName
  const config = {
    projectName: projectName || answers.projectName,
    appName: answers.appName,
    packageId: answers.packageId,
    theme: answers.theme,
    features: answers.features,
    includeBackend: answers.includeBackend,
  };

  // Validate final project name if provided via CLI
  if (projectName) {
    const validation = validateProjectName(projectName);
    if (validation !== true) {
      throw new Error(validation);
    }
  }

  // Display configuration summary
  console.log(chalk.cyan('\n📋 Project Configuration:\n'));
  console.log(chalk.white(`  Name: ${config.projectName}`));
  console.log(chalk.white(`  Display Name: ${config.appName}`));
  console.log(chalk.white(`  Package ID: ${config.packageId}`));
  console.log(chalk.white(`  Theme: ${config.theme}`));
  console.log(
    chalk.white(`  Features: ${config.features.join(', ') || 'none'}`)
  );
  console.log(
    chalk.white(`  Backend: ${config.includeBackend ? 'Yes' : 'No'}`)
  );
  console.log();

  // Confirm
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Proceed with this configuration?',
      default: true,
    },
  ]);

  if (!proceed) {
    console.log(chalk.yellow('\n👋 Setup cancelled.\n'));
    process.exit(0);
  }

  return config;
}
