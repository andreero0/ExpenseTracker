/**
 * Environment Variable Validation
 *
 * Validates that all required environment variables are set before starting the server.
 * This prevents cryptic runtime errors and provides clear feedback to developers.
 */

export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   - ${key}`);
    });
    console.error('\n💡 Create a .env file based on .env.example\n');
    process.exit(1);
  }

  // Validate PORT is a number if provided
  if (process.env.PORT && isNaN(parseInt(process.env.PORT))) {
    console.error('\n❌ PORT must be a valid number\n');
    process.exit(1);
  }

  // Validate NODE_ENV if provided
  const validEnvs = ['development', 'production', 'test'];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    console.warn(`\n⚠️  Warning: NODE_ENV="${process.env.NODE_ENV}" is not standard.`);
    console.warn(`   Expected one of: ${validEnvs.join(', ')}\n`);
  }

  // Optional: Check for OPENAI_API_KEY (for statement import feature)
  if (!process.env.OPENAI_API_KEY) {
    console.warn('\n⚠️  Warning: OPENAI_API_KEY not set.');
    console.warn('   Statement import will use fallback parser instead of AI.\n');
  }

  console.log('✅ Environment variables validated successfully');
}
