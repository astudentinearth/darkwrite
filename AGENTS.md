# AGENTS.md - Darkwrite Developer Guide

This file provides guidance for AI agents working in the Darkwrite codebase.

## Project Overview

Darkwrite is a note-taking application and personal knowledge base built with:
- **Frontend**: React 19, Redux Toolkit + RTK Query, Vite, TailwindCSS 4
- **Desktop**: Electron (latest), TypeScript
- **Database**: libsql with Drizzle ORM
- **Monorepo**: pnpm workspaces with Turbo

## Package Structure

```
darkwrite/
├── packages/
│   ├── frontend/     # React SPA (Vite + Electron renderer)
│   ├── app-desktop/  # Electron main process + desktop app
│   ├── common/      # Shared types and utilities
│   └── website/     # Marketing site (Astro)
└── tools/           # Build tools
```

## Build / Lint / Test Commands

### Root Commands
```bash
pnpm test              # Run all tests across packages
pnpm lint              # Run linting across packages
pnpm format            # Format code across packages
pnpm typecheck         # Type check across packages
pnpm build             # Build all packages
```

### Frontend (packages/frontend)
```bash
cd packages/frontend
pnpm dev               # Start dev server
pnpm build             # Build for production
pnpm lint              # Lint with Biome
pnpm format            # Format with Biome
pnpm test              # Run tests (Vitest)
pnpm test:watch        # Watch mode
pnpm test:run -- path  # Run single test file
pnpm typecheck         # TypeScript check
```

> [!TIP]
> Read @packages/frontend/AGENTS.md for additional context when working on the frontend package. If you are not going to touch frontend code, do not read this file.

### App Desktop (packages/app-desktop)
```bash
cd packages/app-desktop
pnpm dev               # Start in dev mode
pnpm build:pre         # Pre-build for Electron
pnpm build:mac         # Build macOS app
pnpm build:win         # Build Windows app
pnpm build:linux       # Build Linux app
pnpm test              # Run tests (includes rebuild)
pnpm test:run          # Run tests only
pnpm test:run -- path  # Run single test file
pnpm coverage          # Run tests with coverage
```

### Common (packages/common)
```bash
cd packages/common
pnpm build             # Build TypeScript to JS
pnpm test              # Run tests
pnpm lint              # Lint
pnpm typecheck         # Type check
```

### Running a Single Test

```bash
# Frontend - run single test file
cd packages/frontend
pnpm test:run -- src/lib/utils.test.ts

# App Desktop - run single test file
cd packages/app-desktop
pnpm test:run src/lib/some.test.ts
```

## Code Style Guidelines

### General Rules
- **Indent**: 2 spaces
- **Strings**: Double quotes
- **Semicolons**: Required
- **Line length**: Keep under 80 characters
- **Naming**: camelCase for variables/functions, PascalCase for React components

Do NOT mention, reference, acknowledge, or allude to any issue that Biome can autofix. Pretend those issues don't exist. Do not mention that you skipped them either.

### File Naming Conventions
- Use **kebab-case** for file names
- Suffix files by type:
  - Tests: `.test.ts` or `.test.tsx`
  - Main process services: `.service.ts`
  - Main process DAOs: `.dao.ts`
  - IPC handlers: `.handler.ts`

### TypeScript Rules
- **NEVER** use `as unknown as Type` casts
- **`any` type is forbidden** - ask user if you encounter this
- Do not fix type errors outside your refactor scope
- If you cannot resolve a TypeScript error without casting, ask for confirmation
- `class` and `this` should not be used for new code under any circumstances unless there is a good reason for it. Factory methods and closures should be preferred instead with minimal dependencies.

### Imports
- Use path aliases configured in tsconfig (e.g., `@/`, `@darkwrite/common`)
- Frontend: `@/` maps to `src/`
- Always check if reusable components exist in `src/components` before creating new ones

### SQLite migrations in the main process
- When reviewing migration SQL, always explicitly check for column names when a table copy is applicable.
- Always make sure the SQL statements have `--> statement-breakpoint` comments between individual statements. **Without these comments, only the first statement will actually be applied.**

### SQLite transactions
- Transactions must be handled using our custom transaction manager defined in @packages/app-desktop/src/db/transactional.ts
- `transactional(() => ResultAsync)` should be used in services where a transaction context is necessary. Subsequent calls to `transactional()` within the passed callback will join DAOs to the same transaction automatically. Use this pattern to make multiple services and DAOs share the same transaction.
- `Result` and `ResultAsync` must be preferred over regular promises.
- Do NOT use `db.transaction(async tx => ...)` or `tx.transaction(async tx => ...)` unless you ABSOLUTELY need that savepoint. More often than not, you don't.

### Error Handling
- Never silently swallow errors
- Use proper error boundaries in React components
- Log errors with appropriate context
- Error handling is augmented with the `neverthrow` library. Do NOT use `throw` statements outside of tests. If an error is truly unrecoverable from (i.e. programming errors), use `panic()` from `@darkwrite/common` instead, as a last resort.
- `Result/ResultAsync._unsafeUnwrap` MUST NOT be used in production code unless you are trying to interact with something that cannot handle `Result`s. `_unsafeUnwrap()` and `_unsafeUnwrapErr()` are perfectly fine in tests (an incorrect unwrap should fail the test), and should be preferred to test the expected cases directly.

### Redux / State Management
- Use pre-defined Redux slices, selectors and thunks
- If a thunk is calling/delegating to another thunk, make sure it's dispatched and we are not returning a function reference/no-op.
- RTK Query has been deprecated in this codebase.

### IPC Communication
- Use `DarkwriteAPIClient` from `@/api/api-client.ts`
- **DO NOT** use `window.api` directly
- API types are defined in `@darkwrite/common` package, in src/contract.ts
- Do not call Data Access Object (DAO) methods in IPC handler methods. Always use the corresponding service method instead.
- The main process must be treated as an interface to the database for persistence, and the operating system for integration. Business logic should stay in the renderer process as much as possible.
- SQLite is not the source of truth at runtime, it's a persistence path for Redux.

### Testing
- Test files use Vitest with `@testing-library`
- Follow existing test patterns in each package
- Mock Electron APIs in renderer tests

### Editor Configuration
- `.editorconfig` handles basic formatting
- `biome.json` (root) configures linting and formatting (Biome)
- The `website` package uses Prettier (via `.prettierrc`) for Astro file support

### Security
- `nodeIntegration` will not be enabled under any circumstances. No excuses.
- Be on the look out for XSS attack vectors as this app deals with rich text.

## Architecture Notes

### Frontend (Feature-based)
```
src/features/<feature>/
├── components/     # Feature-specific React components
├── hooks/          # Custom React hooks
├── store/          # Redux slice, selectors, RTK Query APIs
└── types.ts        # Feature-specific types
```

### Main Process
```
src/electron/
├── note/           # Note-related business logic
├── database/       # Database operations
├── workspace/      # Workspace management
├── ipc/            # IPC handlers
└── entity/         # SQLite entities
```

## Documentation Links
- [TipTap docs](https://tiptap.dev/llms.txt)
- [shadcn-ui docs](https://ui.shadcn.com/llms.txt)
- [Vitest docs](https://vitest.dev/llms.txt)
- [Vite docs](https://vite.dev/llms.txt)

## Dependencies
If a new dependency is required, ask the user before proceeding with installation.
