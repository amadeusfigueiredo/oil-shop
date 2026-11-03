import dotenv from 'dotenv';

// Load before Sequelize and routes are evaluated. Injected variables take
// precedence over local files; environment-specific files precede .env.
dotenv.config({
  path: [
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
    '.env',
  ],
  quiet: true,
});
