# Project overview

Darkwrite is a note taking application and personal knowledge base, built with the following tech stack:

- React 19
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

Global state is managed with Zustand.

src/features/editor contains a rich text editor based on TipTap/ProseMirror.

## Component usage
Always check if a component already exists in `src/components` or `src/features` before creating a new one. If a component is reusable across multiple features, it should be placed in `src/components`. If it is specific to a feature, it should be placed in the respective feature directory.

# Main process architecture
The main process code is located under `src/electron`. It is responsible for managing the application lifecycle, handling IPC communication, and interacting with the SQLite database via TypeORM.

The main process code is organized into feature-specific modules under `src/electron/note`, `src/electron/database`, and `src/electron/workspace`. Each module contains the necessary code to handle its respective feature.

IPC communication between the renderer and main process is handled via the `src/electron/ipc` directory, which contains the API bridge and handlers. The types are checked automatically on compile time, and the IPC handlers are exposed automatically from a single router object.
