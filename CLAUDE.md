# CineTrack Angular Project - Claude Code Guide

This file provides essential information for Claude Code instances working with the CineTrack Angular repository. It documents common development commands, project architecture, and patterns to accelerate productivity.

## Development Commands

### Serving
- `pnpm start` or `pnpm ng serve` - runs the Angular development server on http://localhost:4200 with hot reload

### Building
- `pnpm run build` or `pnpm ng build` - builds optimized production files to the `dist/` directory
- `pnpm run watch` - continuous rebuild with source maps (development mode)

### Testing
- `pnpm test` or `pnpm ng test` - runs unit tests using Vitest (though executed via Angular CLI, test files follow *.spec.ts convention)
- End-to-end testing: `pnpm ng e2e` - requires additional setup (not currently configured)

### Linting & Formatting
- No ESLint lint configuration is currently present in the repository
- Code formatting with Prettier: `pnpm dlx prettier --write .` (you may want to add an npm script for convenience)

### Code Generation
- `pnpm ng generate component <name>` - creates a new standalone component
- Other available schematics: service, pipe, directive, guard, interceptor, etc.
- Run `pnpm ng generate --help` for a complete list of available schematics

## Project Structure & Architecture

### Standalone Components
All Angular components in this project are standalone (no NgModules). Components declare their dependencies in an `imports` array within the `@Component` decorator.

Example from `src/app/app.ts`:
```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Standalone component
  templateUrl: './app.html',
  styleUrl: './app.css',
})
```

### Routing & Lazy Loading
- Routes are defined in `src/app/app.routes.ts`
- Components are lazy-loaded using `loadComponent()` for better performance
- Protected routes use `CanActivate` guards

Example route configuration:
```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'tracks', pathMatch: 'full' },
  { path: 'tracks', loadComponent: () => import('./track-list/track-list').then((m) => m.TrackList) },
  { path: 'tracks/new', canActivate: [authGuard], loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'tracks/:id', loadComponent: () => import('./track-detail/track-detail').then((m) => m.TrackDetail) },
  { path: 'tracks/:id/edit', canActivate: [authGuard], loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login) },
];
```

### Services
- **AuthService** (`src/app/services/auth.service.ts`):
  - Handles user authentication (login/logout)
  - Stores JWT token in localStorage
  - Exposes reactive state via Angular signals:
    - `isLoggedIn()` - returns boolean indicating authentication status
    - `user()` - returns the current user object or null
- **TrackService** (`src/app/services/track.service.ts`):
  - Handles operations for music tracks including CRUD and favorites management
  - Communicates with backend API at `http://localhost:3000/tracks`
  - Methods: getTracks(), getTrack(id), search(query), create(), update(), remove(), getFavorites(), addFavorite(), removeFavorite()

### Guards
- **AuthGuard** (`src/app/guards/auth-guard.ts`):
  - Implements `CanActivateFn` to protect routes
  - Redirects unauthenticated users to the login page
  - Uses AuthService to check authentication status

### State Management
- Uses Angular Signals (`signal`, `computed`, `effect`) for reactive state management
- Examples:
  - Token storage: `private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))`
  - Computed values: `readonly isLoggedIn = computed(() => this.tokenSignal() !== null)`

### Environment & Backend Configuration
- Frontend environment: `src/environnements/environnement.ts` - contains `apiUrl: 'http://localhost:3000'` and feature flags (e.g., `favoritesEnabled: true`)
- Backend API: Located in the `music-api/` directory
  - Built with Node.js/Express
  - Uses SQLite for data storage and bcrypt/jsonwebtoken for authentication
  - Provides REST endpoints:
    - `GET /tracks` - retrieve all tracks
    - `GET /tracks/:id` - retrieve specific track
    - `POST /tracks` - create new track
    - `PATCH /tracks/:id` - update track
    - `DELETE /tracks/:id` - delete track
    - `POST /login` - authenticate user
    - `GET /favorites` - retrieve user's favorites (public endpoint)
    - `POST /favorites/:trackId` - add track to favorites (auth required)
    - `DELETE /favorites/:trackId` - remove track from favorites (auth required)
- To start the backend:
  - Development mode: `cd music-api && pnpm dev` (uses `--watch` flag)
  - Production mode: `cd music-api && pnpm start`

### Styling
- Global styles: `src/styles.css`
- Component-specific styles: Individual `.css` files accompanying each component (e.g., `track-list/track-list.css`)
- Prettier is configured for code formatting (see `.prettierrc`)

## Additional Notes

### Package Manager
- This project uses **pnpm** as the package manager
- If you prefer npm or yarn, equivalent commands can be used:
  - `npm run start` or `yarn start` instead of `pnpm start`
  - etc.

### File Naming Conventions
- Specification/test files: `*.spec.ts` (e.g., `track-list.spec.ts`)
- Component files: named after the component (e.g., `track-list.ts`, `track-list.html`, `track-list.css`)
- Services: `*.service.ts`
- Guards: `*.guard.ts`
- Interceptors: `*.interceptor.ts`
- Pipes: `*.pipe.ts`
- Directives: `*.directive.ts`
- Models: `*.ts` in `src/app/models/`

### Common Paths
- Components: `src/app/` (with subdirectories for feature areas)
- Services: `src/app/services/`
- Guards: `src/app/guards/`
- Models: `src/app/models/`
- Pipes: `src/app/pipes/`
- Directives: `src/app/directives/`
- Interceptors: `src/app/interceptors/`

### Running the Full Stack Locally
For complete local development with both frontend and backend:
1. **Start the backend API**:
   ```bash
   cd music-api
   pnpm dev    # or: npm run dev
   ```
   The API will be available at http://localhost:3000

2. **Start the frontend**:
   ```bash
   # In a separate terminal, from the project root
   pnpm start  # or: npm run start
   ```
   The Angular app will be available at http://localhost:4200

The frontend will automatically communicate with the backend API at the configured URL (`http://localhost:3000`).

## Verification Notes
- All commands listed above have been verified against `package.json` and `angular.json`
- The architecture description matches the actual source files examined
- Testing uses Vitest but is executed via Angular CLI's `ng test` command
- No linting configuration is currently present, though Prettier is installed for formatting

---

*This guide is intended to help Claude Code instances quickly understand and work with the CineTrack Angular codebase. For the most up-to-date information, always refer to the actual source files and configuration.*