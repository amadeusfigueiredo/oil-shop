# Webshop Portfolio Application

E-commerce platform with the followed functionalities and technologies

## Live on

[https://oylo.netlify.app](https://oylo.netlify.app)

## Technologies Stack

- **Backend**: Node / Express / JavaScript
- **Frontend**: Vite / React / TypeScript / Sass
- **Tests**: Vitest / React Testing Library
- **File Storage**: AWS S3
- **Database**: PostgreSQL
- **ORM**: Sequelize

## Functionalities

### Translation

The application supports multiple languages, currently including:

- English
- German

### Responsive Design

The application is designed to be fully responsive and works seamlessly across various devices and screen sizes.

### Login System

A secure login system with role-based access control.

### User Roles

- **Admin**: Can perform CRUD operations on users and products.
- **Customer**: Registered users can manage their personal data and perform operations available to them.

## Screenshots

### Homepage

![Homepage](frontend/public/assets/readmeHomePage.png)

### Shop page

![Shop Page](frontend/public/assets/readmeShopPage.png)

### Product Listing

![Product Listing](frontend/public/assets/readmeProductsListing.png)

## Development

Use Node **24.19.0** (`nvm use` reads `.nvmrc`) and PostgreSQL 17. The frontend uses React 19, Vite 8, and TypeScript 6; both projects use Vitest 5 and ESLint 10.

```sh
npm run setup
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set `DATABASE_URL` for your local PostgreSQL database and set `JWT_KEY` to a cryptographically random secret of at least 32 bytes. Keep credentials in local environment files or environment settings, never in Git. Environment variables take precedence over `.env.development`/`.env.production`, which take precedence over `.env`.

```sh
cd backend
npm run db:create       # only when the database does not exist
npm run db:migrate
npm run seed:roles
npm run seed:productCategories
npm run seed:products
npm run dev
```

In another terminal, run `npm start --prefix frontend`. Local defaults use frontend port 5173 and API port 3001. Use the same hostname for both, such as `127.0.0.1`, so HTTP development cookies are same-site. Set `IS_SECURE=true` for cross-site HTTPS deployment, and set `API_URL` to the exact frontend origin. Product reads and customer registration are public; product management, upload signing, user listing, and administrator creation require an administrator account. Account, shipping, and order access is limited to the owner or an administrator. Administrator creation is not a public signup operation.

The migration scripts use Umzug while preserving the existing migration files and `SequelizeMeta` history. `npm run db:undo-migrate` rolls back the latest migration. `db:drop` deletes the configured database; use it only for disposable development databases. Existing seed scripts contain demo accounts; do not seed them into production.

S3 uploads require permission to write to `oylo-images` in `us-east-2`. The backend uses AWS SDK v3's normal credential provider chain; the existing `AWS_ACCESS_KEY`/`AWS_SECRET_KEY` variables remain supported when both are present. Uploads are optional for browsing and local catalog development.

## Quality checks

From the repository root:

```sh
npm run check           # lint, strict type checking, tests, production build, formatting
npm run format          # apply the package formatting rules
```

Tests run once by default. Use `npm run test:watch --prefix frontend` or `--prefix backend` for watch mode, and `npm run test:coverage --prefix frontend` or `--prefix backend` for coverage. Backend tests mock external boundaries and do not need a running database or AWS credentials. CI runs frozen installs, lint, formatting, tests for both packages, and the frontend production build.

TypeScript remains on 6.0.x because the current TypeScript ESLint parser supports versions below 6.1; TypeScript 7 is not yet compatible. Node types follow the Node 24 runtime. Other retained direct dependencies use current stable releases at the time of this upgrade. Unused webpack loaders, Node Sass, AWS SDK v2, Babel/Jest, and the legacy Sequelize CLI were removed. Node's built-in watch mode replaces Nodemon.

The manifests document two transitive security overrides: Minimatch 11 for compatible named-export consumers, and UUID 11 for Sequelize's CommonJS-compatible UUID API. Keep these overrides until upstream dependency ranges include the patched versions; rerun `npm ls --all`, `npm audit`, and the quality checks when changing them. Commit lockfile changes together with manifest updates.

The backend Docker image installs only production dependencies and runs as the `node` user. Standard build: `docker build -t oil-shop-backend backend`. In a managed environment with a proxy CA, pass `--secret id=proxy_ca,src="$CODEX_PROXY_CERT"`; the CA is mounted only during installation and is not copied into the image.
