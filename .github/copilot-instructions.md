# React MUI Starter Kit — Copilot Instructions

## Project Context

This is a **starter kit / boilerplate**. Files that currently exist in `src/pages/auth/`, `src/services/auth.service.ts`, `src/hooks/`, and `src/contexts/` are **pattern references only** — they demonstrate the correct SOP, folder structure, and code style for this project.

| File | Role |
|---|---|
| `src/services/auth.service.ts` | Contoh pola Service (url object + EventSend functions) |
| `src/services/api.service.ts` | Singleton API client — **DO NOT copy per feature** |
| `src/pages/auth/login.page.tsx` | Contoh pola Page (useMutation + useZod form) |
| `src/pages/auth/register.page.tsx` | Contoh pola Page (with onError handling) |
| `src/hooks/use-zod.ts` | Contoh pola custom hook |
| `src/schemas/_schema.config.ts` | Contoh pola Zod schema config |
| `src/router.tsx` | Contoh pola Router (protected routes with loader) |

When asked to build a new feature: **read these reference files first** to understand the existing pattern, then generate new code that follows the same structure.

## Stack

React 19, MUI 7 (`@mui/material`, `@mui/icons-material`, `@mui/lab`), TypeScript (strict), Vite 7, react-router 7, ezhooks 2, zod 4.

## Architecture

```
Pages
  └─ useMutation (ezhooks) ← form state + API calls
  └─ useZod         ← form validation
  └─ Contexts       ← useAuth, useApp, useSnackbar, useAlert

Services     ← all API calls, always accept EventSend
Schemas      ← Zod shapes + inferred TypeScript types
Hooks        ← reusable UI/logic hooks
Components   ← UI building blocks (never fetch data directly)
```

**Rules:**
- Pages call services via `useMutation`/`useTable`/`useRequest` — never call `api.*` directly from a page.
- Services are pure functions: always accept `EventSend`, call `api.*`, return the Promise.
- `api.service.ts` is a singleton — import it inside services only, never in pages or components.
- Components receive data as props — never import services inside components.
- Schemas only contain Zod definitions — no logic.
- Always use **path aliases**, never relative paths (except within the same folder).

## Folder Structure

```
src/
  pages/          # @pages/* — page components, one folder per domain
    {domain}/
      index.page.tsx     # list/table view
      create.page.tsx    # create form
      update.page.tsx    # edit form
      view.page.tsx      # detail view
      partial/
        Form.tsx         # shared form component for create/update
  services/       # @services/* — API service functions
  hooks/          # @hooks/* — custom React hooks
  schemas/        # @schemas/* — Zod schemas + inferred types
  components/     # @components/* — reusable UI components
    ui/           # global atomic UI (Button, Input, Dialog, Skeleton…)
    base/         # global composite components (DataTable, TableView, Dropdown…)
    shared/       # feature-specific but reusable across multiple pages/domains
    layouts/      # AppLayout, GuestLayout
    templates/    # PageTemplate
  contexts/       # @contexts/* — React context providers
  commons/        # @commons/* — shared constants / dummy defaults
  typings/        # @typings/* — global TypeScript types
  reducers/       # @reducers/* — standalone useReducer logic
  constants/      # @constants/* — enums and static constants
  utils/          # @utils/* — pure utility functions
  generate-template/  # regen codegen templates — excluded from build (@ignored)
```

## Path Aliases

| Alias | Resolves to |
|---|---|
| `@components/*` | `src/components/*` |
| `@pages/*` | `src/pages/*` |
| `@hooks/*` | `src/hooks/*` |
| `@services/*` | `src/services/*` |
| `@schemas/*` | `src/schemas/*` |
| `@commons/*` | `src/commons/*` |
| `@typings/*` | `src/typings/*` |
| `@reducers/*` | `src/reducers/*` |
| `@constants/*` | `src/constants/*` |
| `@utils/*` | `src/utils/*` |
| `@contexts/*` | `src/contexts/*` |

## ezhooks API

| Hook | When to use |
|---|---|
| `useMutation` (from `ezhooks/lib/useMutation`) | Form submit, create, update, delete — whenever sending data |
| `useTable` (from `ezhooks/lib/useTable`) | Paginated/filterable data tables |
| `useRequest` (from `ezhooks/lib/useRequest`) | One-off read requests (e.g. fetch detail by ID) |

`EventSend` (from `ezhooks`) — the parameter type all service functions accept:
```
event.data?.()     // form data getter
event.params       // route/query params  { id, ... }
event.ctr          // AbortController
event.ctr.signal   // pass to fetch signal
```

## Contexts

| Hook | Provided by | Methods / values |
|---|---|---|
| `useAuth()` | `@contexts/AuthContext` | `isLogin`, `user`, `setLogin`, `setUser`, `setToken`, `getToken`, `clear` |
| `useApp()` | `@contexts/AppContext` | `isMobile`, `trigger`, `setTrigger`, `setWatch`, `onClickOpen` |
| `useSnackbar()` | `@contexts/SnackbarContext` | `setSnackbar(message, options?)` |
| `useAlert()` | `@contexts/AlertContext` | `alert`, `set(partial)`, `reset()`, `setRemark` |

## Global Types

```typescript
// @typings/index
export type HttpResponse<T> = { total?: number; data: T };
export type Me = { name: string; email: string; phoneNumber: string };
```

## Schema Convention

Always import zod through the config, never raw:
```typescript
import z from "@schemas/_schema.config";  // ✓
import * as z from "zod";                // ✗
```

Export both schema and inferred type:
```typescript
export const inputProductSchema = z.object({ ... });
export type InputProductSchema = z.infer<typeof inputProductSchema>;
```

## Error Handling in Pages

```typescript
onError: (e) => {
  if (e instanceof Response) {
    if (e.status === 422) {
      e.json().then((resp) => {
        validation.setError(ctm.parse(resp.error));  // or manual setError
      });
    }
  }
}
```

Use `useSnackbar` for toast feedback. Use `useAlert` for confirmation dialogs (especially delete).

## CRUD Page Pattern

Each domain lives under `src/pages/{domain}/`:

| File | Responsibility |
|---|---|
| `index.page.tsx` | `useTable` — paginated list with filters, `Dropdown` actions |
| `create.page.tsx` | `useMutation` + `useZod` + `Form` — POST |
| `update.page.tsx` | `useMutation` + `useZod` + `Form` + fetch by ID — PUT |
| `view.page.tsx` | `useRequest` + `TableView` — read-only detail |
| `partial/Form.tsx` | Shared form UI, receives `mutation`, `validation`, `onSubmit` as props |

## Naming Conventions

| File | Filename | Export |
|---|---|---|
| Service | `{domain}.service.ts` | named functions: `getAll{Model}`, `post{Model}`, `put{Model}`, `get{Model}ID`, `delete{Model}` |
| Schema | `{domain}.schema.ts` | `{action}{Model}Schema` + `type {Action}{Model}Schema` |
| Page | `{domain}.page.tsx` | `default function Page` (or named if needed) |
| Hook | `use-{name}.ts` | `default useXxx` or named export |
| Context | `{Name}Context.tsx` | `default {Name}Provider`, named `use{Name}` |
| Component | `{Name}.tsx` | `default {Name}` |

## References

- Layer patterns → `.github/instructions/frontend-layer.instructions.md`
