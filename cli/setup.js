/**
 * Project Setup
 * Handles project creation and customization
 */

import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get template directory path
 */
function getTemplateDir() {
  // Template is in the parent directory (ExpenseTracker root)
  return path.resolve(__dirname, '..');
}

/**
 * Replace placeholders in file content
 */
function replacePlaceholders(content, config) {
  return content
    .replace(/ExpenseTracker/g, config.appName)
    .replace(/com\.yourcompany\.expensetracker/g, config.packageId)
    .replace(/mobile/g, config.projectName)
    .replace(/wallet-api/g, `${config.projectName}-api`);
}

/**
 * Replace placeholders in a file
 */
async function replaceInFile(filePath, config) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const replaced = replacePlaceholders(content, config);
    await fs.writeFile(filePath, replaced, 'utf-8');
  } catch (error) {
    // Skip binary files or files that can't be read as text
    if (error.code !== 'ENOENT') {
      console.warn(chalk.yellow(`  Warning: Could not process ${filePath}`));
    }
  }
}

/**
 * Copy template files to project directory
 */
async function copyTemplate(config, projectPath) {
  const spinner = ora('Copying template files...').start();

  try {
    const templateDir = getTemplateDir();

    // Files and directories to copy
    const itemsToCopy = ['mobile', 'theme', 'ARCHITECTURE.md', 'README.md'];

    if (config.includeBackend) {
      itemsToCopy.push('backend');
    }

    // Copy each item
    for (const item of itemsToCopy) {
      const src = path.join(templateDir, item);
      const dest = path.join(projectPath, item);

      if (await fs.pathExists(src)) {
        await fs.copy(src, dest, {
          filter: (src) => {
            // Exclude certain files/directories
            const exclude = [
              'node_modules',
              '.expo',
              '.git',
              'dist',
              'build',
              '__pycache__',
              '.env',
              '.DS_Store',
            ];
            return !exclude.some((pattern) => src.includes(pattern));
          },
        });
      }
    }

    // Copy CLI directory for self-replication
    await fs.copy(
      path.join(templateDir, 'cli'),
      path.join(projectPath, 'cli')
    );

    spinner.succeed('Template files copied');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }
}

/**
 * Customize project files
 */
async function customizeProject(config, projectPath) {
  const spinner = ora('Customizing project...').start();

  try {
    // Files to process
    const filesToProcess = [
      'mobile/package.json',
      'mobile/app.json',
      'mobile/README.md',
      'README.md',
      'ARCHITECTURE.md',
    ];

    if (config.includeBackend) {
      filesToProcess.push('backend/app/main.py', 'backend/README.md');
    }

    // Replace placeholders in each file
    for (const file of filesToProcess) {
      const filePath = path.join(projectPath, file);
      if (await fs.pathExists(filePath)) {
        await replaceInFile(filePath, config);
      }
    }

    // Update app.json with correct app name and package ID
    const appJsonPath = path.join(projectPath, 'mobile/app.json');
    if (await fs.pathExists(appJsonPath)) {
      const appJson = await fs.readJson(appJsonPath);
      appJson.expo.name = config.appName;
      appJson.expo.slug = config.projectName;
      appJson.expo.ios.bundleIdentifier = config.packageId;
      appJson.expo.android.package = config.packageId;
      await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
    }

    // Update mobile package.json
    const mobilePackageJsonPath = path.join(
      projectPath,
      'mobile/package.json'
    );
    if (await fs.pathExists(mobilePackageJsonPath)) {
      const packageJson = await fs.readJson(mobilePackageJsonPath);
      packageJson.name = config.projectName;
      await fs.writeJson(mobilePackageJsonPath, packageJson, { spaces: 2 });
    }

    spinner.succeed('Project customized');
  } catch (error) {
    spinner.fail('Failed to customize project');
    throw error;
  }
}

/**
 * Remove unwanted features
 */
async function removeUnwantedFeatures(config, projectPath) {
  const spinner = ora('Configuring features...').start();

  try {
    const { features } = config;

    // Remove example screens if not wanted
    if (!features.includes('examples')) {
      const examplesPath = path.join(projectPath, 'mobile/app/(root)/create.tsx');
      if (await fs.pathExists(examplesPath)) {
        await fs.remove(examplesPath);
      }
    }

    // Remove onboarding if not wanted
    if (!features.includes('onboarding')) {
      const onboardingPath = path.join(
        projectPath,
        'mobile/app/onboarding'
      );
      if (await fs.pathExists(onboardingPath)) {
        await fs.remove(onboardingPath);
      }
    }

    spinner.succeed('Features configured');
  } catch (error) {
    spinner.fail('Failed to configure features');
    throw error;
  }
}

/**
 * Install dependencies
 */
async function installDependencies(config, projectPath, options) {
  if (options.skipInstall) {
    console.log(chalk.yellow('\n⏭  Skipping dependency installation\n'));
    return;
  }

  // Install mobile dependencies
  const mobileSpinner = ora('Installing mobile dependencies...').start();
  try {
    await execa('npm', ['install'], {
      cwd: path.join(projectPath, 'mobile'),
      stdio: 'pipe',
    });
    mobileSpinner.succeed('Mobile dependencies installed');
  } catch (error) {
    mobileSpinner.fail('Failed to install mobile dependencies');
    console.log(
      chalk.yellow(
        '  Run "npm install" in the mobile directory manually'
      )
    );
  }

  // Install backend dependencies if included
  if (config.includeBackend) {
    const backendSpinner = ora('Installing backend dependencies...').start();
    try {
      await execa('pip', ['install', '-r', 'requirements.txt'], {
        cwd: path.join(projectPath, 'backend'),
        stdio: 'pipe',
      });
      backendSpinner.succeed('Backend dependencies installed');
    } catch (error) {
      backendSpinner.fail('Failed to install backend dependencies');
      console.log(
        chalk.yellow(
          '  Run "pip install -r requirements.txt" in the backend directory manually'
        )
      );
    }
  }
}

/**
 * Initialize git repository
 */
async function initializeGit(projectPath, options) {
  if (options.skipGit) {
    console.log(chalk.yellow('\n⏭  Skipping git initialization\n'));
    return;
  }

  const spinner = ora('Initializing git repository...').start();

  try {
    await execa('git', ['init'], { cwd: projectPath });
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa(
      'git',
      ['commit', '-m', 'Initial commit: App scaffold'],
      { cwd: projectPath }
    );
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize git');
    console.log(chalk.yellow('  You can initialize git manually later'));
  }
}

/**
 * Create .env files
 */
async function createEnvFiles(projectPath) {
  const spinner = ora('Creating environment files...').start();

  try {
    // Copy .env.example to .env for mobile
    const mobileEnvExample = path.join(projectPath, 'mobile/.env.example');
    const mobileEnv = path.join(projectPath, 'mobile/.env');
    if (await fs.pathExists(mobileEnvExample)) {
      await fs.copy(mobileEnvExample, mobileEnv);
    }

    // Copy .env.example to .env for backend
    const backendEnvExample = path.join(
      projectPath,
      'backend/.env.example'
    );
    const backendEnv = path.join(projectPath, 'backend/.env');
    if (await fs.pathExists(backendEnvExample)) {
      await fs.copy(backendEnvExample, backendEnv);
    }

    spinner.succeed('Environment files created');
  } catch (error) {
    spinner.fail('Failed to create environment files');
    console.log(
      chalk.yellow(
        '  Copy .env.example to .env manually and configure your environment variables'
      )
    );
  }
}

/**
 * Main setup function
 */
export async function setupProject(config, options) {
  const projectPath = path.resolve(process.cwd(), config.projectName);

  console.log(chalk.cyan(`\n📁 Creating project in ${projectPath}\n`));

  // Create project directory
  await fs.ensureDir(projectPath);

  // Copy template
  await copyTemplate(config, projectPath);

  // Customize project
  await customizeProject(config, projectPath);

  // Configure features
  await removeUnwantedFeatures(config, projectPath);

  // Create .env files
  await createEnvFiles(projectPath);

  // Install dependencies
  await installDependencies(config, projectPath, options);

  // Initialize git
  await initializeGit(projectPath, options);

  return projectPath;
}
