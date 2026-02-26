# Project overview

Darkwrite is a note taking application and personal knowledge base, built with the following tech stack:

- React 19
- Redux Toolkit with RTK Query
- Vite
- TailwindCSS 4
- Electron (latest release)
- TypeScript
- pnpm

# Project structure

```
src
- api -> frontend API client implementation
- assets -> assets that are imported directly with Vite, e.g. SVG icons imported via svgr
- common -> shared modules between main and the renderer process
- components -> reused react components that don't belong to a specific feature
- features -> feature specific components, hooks, state management, etc.
- context -> non-specific global stores
- hooks -> non-specific react hooks
- lib -> non-specific frontend modules
- locales -> i18n translations
- query -> react query hooks, DO NOT CREATE NEW HOOKS IN THIS DIRECTORY, as we are moving to a feature based structure
- test -> vitest setup code and mocks
- electron -> main process code
  - note, database, workspace -> main process modules for specific features
  - db -> typeorm data source
  - entity -> sqlite entities
  - ipc -> API bridge and handlers
  - lib -> non-specific main process modules
  - migrator -> code to handle migrations
    - alpha-to-v1.ts -> this migrates from the alpha version of darkwrite to v1, DO NOT TOUCH UNDER ANY CIRCUMSTANCES
  - preload -> preload script code
  - init.ts -> app init code
  - main.ts -> main process entry point

# Frontend architecture
Darkwrite follows a feature-based architecture for the frontend code. Each feature has its own directory under `src/features`, which contains all the components, hooks, state management, and other related code for that feature. This helps to keep the code organized and makes it easier to maintain and scale the application.

The application is a React Single Page Application (SPA) bundled with Vite.

Routing is done with react-router-dom hash router.

Global state is managed with Redux slices. Do NOT directly subscribe to RTK Query endpoint data. Always use pre-defined selectors and slices, such as `notesSlice` or `settingsSlice`. The store for each feature can be found under `@/features/<feature>/store/<feature>-slice.ts`

**UNDER NO CIRCUMSTANCES** do updates on notes without using the pre-defined actions. Do NOT dispatch into the entity adapter directly unless you are creating a new mutation.

src/features/editor contains a rich text editor based on TipTap/ProseMirror.

> [!IMPORTANT]
> React Query is being deprecated from our codebase as part of a refactor. We are moving to Redux Toolkit with RTK Query. Do not check queries inside @/query/*. Everything inside @/query is deprecated unless otherwise specified.

## Feature folder structure
```

feature-name

- components # react components that belong to this feature
- hooks # react hooks
- store # redux store code and rtk query APIs
  - <feature>-slice.ts # the redux slice and reducers for this feature
  - <feature>-selectors.ts # redux selectors for this feature
  - <feature>-api.ts # RTK query APIs for this feature, actions and mutations # can have separate -api.ts files
- types.ts # types specific to this feature

```


## Component usage
Always check if a component already exists in `src/components` or `src/features` before creating a new one. If a component is reusable across multiple features, it should be placed in `src/components`. If it is specific to a feature, it should be placed in the respective feature directory.

## API access
Use the DarkwriteAPIClient class in @/api/api-client.ts when you need to call APIs from the frontend code. **DO NOT USE `window.api` directly.**

## API contract
The API is strictly typed. The type definitions are available in `@/common/contract.ts`
If existing APIs cannot solve the problem, DO NOT create a new API without asking the user for specifications.

# Main process architecture
The main process code is located under `src/electron`. It is responsible for managing the application lifecycle, handling IPC communication, and interacting with the SQLite database via TypeORM.

The main process code is organized into feature-specific modules under `src/electron/note`, `src/electron/database`, and `src/electron/workspace`. Each module contains the necessary code to handle its respective feature.

IPC communication between the renderer and main process is handled via the `src/electron/ipc` directory, which contains the API bridge and handlers. The types are checked automatically on compile time, and the IPC handlers are exposed automatically from a single router object.

# Translations
Translations are managed using i18next. All translation files are located under `src/locales`. Each language has its own JSON file containing the translations for that language.

When adding new translations, ensure that the keys are consistent across all language files. Use descriptive keys that clearly indicate the purpose of the translation.

# Dependencies
If a new dependency is absolutely required to solve a problem, ask the user before proceeding with installation.

# Code style
- Indent with 2 spaces.
- Use semicolons at the end of statements.
- Use double quotes for strings.
- Use camelCase for variable and function names.
- Use PascalCase for React component names.
- Keep lines under 80 characters.
- Add JSDoc comments for exported symbols and complex code.
- Do not add JSDoc comments on trivial methods/symbols that don't need explanation.

# File naming convention
- Use kebab-case for file names.
- TypeScript files should indicate their type in the filename if they fall into one of these categories:
  - Tests: .test.ts or .test.tsx (or append .test to the filename, like .dao.test.ts)
  - TypeORM entities: .entity.ts
  - Main process services: .service.ts
  - Main process DAOs: .dao.ts (or .repository.ts, however .dao.ts is the new convention)
  - Main process IPC handlers: .handler.ts

# Code quality
- NEVER use casts like `as unknown as Type`
- If there's a TypeScript error you cannot resolve without casting, abort execution and ask for user confirmation.
- Do not touch type errors unrelated to the refactor you are working on. Do not get out of the scope of your prompt.
- `any` type is forbidden. If you encounter a situation where you think `any` is necessary, abort execution and ask for user confirmation.

# Documentation
> Always fetch the latest TipTap documentation, as TipTap v3 has introduced major changes.
- [TipTap's docs](https://tiptap.dev/llms.txt)
- [shadcn-ui docs](https://ui.shadcn.com/llms.txt)
- [Vitest docs](https://vitest.dev/llms.txt)
- [Vite docs](https://vite.dev/llms.txt)
```
