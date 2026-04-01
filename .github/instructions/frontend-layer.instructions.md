---
applyTo: "src/**"
---

# Frontend Layer Instructions

These rules apply whenever you create or edit files in `src/`. Always read the referenced pattern files before generating new code.

---

## File Naming Convention

Rules:
- **Default format**: All file and folder names must use kebab-case (lowercase with hyphens): `user-profile.service.ts`, `auth-context.tsx`, `error-handler.utils.ts`
- **Component exception**: Files inside `src/components/` must use PascalCase: `UserProfile.tsx`, `DataTable.tsx`, `ErrorDialog.tsx`
- **Consistency**: Stick to the naming pattern within each directory type
- **Extensions**: Use `.tsx` for React components, `.ts` for TypeScript files, `.js` for plain JavaScript (avoid mixing)
- **Descriptive names**: File names should clearly indicate their purpose and type: `user.service.ts`, `auth.constant.ts`, `date.utils.ts`

---

## Variable Naming Convention

Rules:
- **Regular variables**: Use camelCase for variable names: `userId`, `userName`, `isLoading`, `hasPermission`
- **Constants**: Use CAPITAL separator snake_case in the format `{CAPITAL}_{CAPITAL}` for constants: `USER_PROFILE`, `AUTH_TOKEN`, `DATA_TABLE`, `API_BASE_URL`, `MAX_RETRY_COUNT`
- **Boolean variables**: Prefix with `is`, `has`, `can`, `should` using camelCase: `isLoading`, `hasPermission`, `canEdit`
- **Consistency**: Maintain the same naming pattern throughout the codebase
- **Descriptive naming**: Variable names should clearly indicate their purpose and data type

---

## Function Return Convention

Rules:
- **Always use explicit block body with `return`**: All functions — arrow functions, named functions, and callbacks — must use `{ return }` syntax. Never use concise implicit return (arrow function without braces).
- **Applies to all function types**: This rule covers arrow functions, regular functions, callbacks, and service functions.

  ```typescript
  // ✓ correct — explicit block body
  const getUser = (id: number) => {
    return api.get<UserResponse>(`/users/${id}`);
  };

  const double = (n: number) => {
    return n * 2;
  };

  const items = list.map((item) => {
    return item.id;
  });

  // ✗ wrong — implicit return (no braces)
  const getUser = (id: number) => api.get<UserResponse>(`/users/${id}`);

  const double = (n: number) => n * 2;

  const items = list.map((item) => item.id);
  ```

- **Exception — JSX in component render**: Component function bodies that return JSX may use the standard `return (...)` pattern inside a block body — this rule does not change how JSX is rendered, only prevents concise implicit returns.

---

## Modal and Dialog Patterns

Rules:
- **Router-based modals**: Implement modals as route-based components using React Router outlets instead of state-managed overlays
- **URL accessibility**: Each modal/dialog should have its own route path for direct access and browser history support
- **Nested routing**: Use nested routes with outlets for modal workflows within existing pages
- **Route structure**: Follow RESTful patterns for modal routes (create, edit, view actions as child routes)
- **Navigation handling**: Handle modal close via router navigation, not local state management
- **Deep linking**: Ensure modals can be opened directly via URL and maintain state on page refresh
- **Parent-child relationship**: Modal routes should be children of their parent page routes using outlet pattern

---

## Component Development Approach

Rules:
- **UX-first development**: Always design and implement the user experience flow before building the visual interface
- **Behavior before appearance**: Focus on component logic, data flow, and user interactions before styling
- **Progressive enhancement**: Start with functional components, then add visual polish and animations
- **Accessibility priority**: Built-in accessibility features during UX phase, not as an afterthought
- **State management design**: Plan component state and data flow during UX phase
- **User journey mapping**: Consider how the component fits into overall user workflows before implementation
- **Responsive thinking**: Plan mobile and desktop experiences during UX phase, not during UI refinement

---

## Service Layer (`src/services/`)

**Read this file to understand the pattern:** `src/services/auth.service.ts`

Rules:
- Every service file defines a `url` object as a single source of truth for all endpoints in that domain.
- Every service function accepts exactly one parameter: `event: EventSend` (from `ezhooks`).
- Import `api` from `./api.service` — never from `@services/api.service` or anywhere else. `api.service.ts` is a singleton, do not re-instantiate it.
- Never import `api` in a page or component — only inside service files.
- Service functions return the `api.*` call directly (no wrapping, no try/catch unless explicitly needed).
- Use typed generics on `api.get<T>`, `api.post<T>`, etc. matching the response shape.
- Declare reusable response types at the top of each service file: `All{Model}Response`, `{Model}Response`.

```
// url object — mandatory
const url = {
  index: "/{resource}",
};

// getAll — paginated list, passes params + signal
export const getAll{Model} = (event: EventSend) =>
  api.get<All{Model}Response>(url.index, { params: event.params, signal: event.ctr.signal });

// getByID — append /{id} to url.index
export const get{Model}ID = (event: EventSend) => {
  const { id } = event.params;
  return api.get<{Model}Response>(`${url.index}/${id}`, { signal: event.ctr.signal });
};

// post — event.data?.() for request body
export const post{Model} = (event: EventSend) =>
  api.post<{Model}Response>(url.index, event.data?.(), { signal: event.ctr.signal });

// put — event.data?.() for request body
export const put{Model} = (event: EventSend) =>
  api.put<{Model}Response>(url.index, event.data?.(), { signal: event.ctr.signal });

// delete — append /{id}, no response body needed
export const delete{Model} = async (event: EventSend) => {
  const { id } = event.params;
  await api.delete(`${url.index}/${id}`, { signal: event.ctr.signal });
};
```

---

## Page Layer (`src/pages/{domain}/`)

**Read these files to understand the pattern:**
- `src/pages/auth/login.page.tsx` — useMutation + useZod form flow
- `src/pages/auth/register.page.tsx` — form page with onError 422 handling

### Create / Update Page Rules:
- Use `useMutation` (from `ezhooks/lib/useMutation`) for form state and submission.
- Use `useZod` (from `@hooks/use-zod`) for Zod-based validation.
- Always pass `data: mutation.data` to `useZod` so validation reads live form state.
- Call `mutation.send({ service, onSuccess, onError })` to submit.
- Reset form on success: `mutation.reset()`.
- Validate before sending: `const valid = validation.validated(); if (valid) { mutation.send(...) }`.
- Never call `api.*` directly in a page.

### Index Page Rules:
- Use `useTable` (from `ezhooks/lib/useTable`) with `service`, `selector`, `total`, `replaceUrl: true`.
- Render with `DataTablePage` + `Dropdown` for row actions.
- Delete confirmation uses `useAlert` → `alert.set({ open: true, ... confirm: { onClick: () => { ... } } })`.

### View Page Rules:
- Use `useRequest` (from `ezhooks/lib/useRequest`) for fetching detail by ID.
- Read `id` from `useParams()`.
- Call `client.exec({ service: get{Model}ID(+id), onSuccess: (data) => data.data })` inside `useEffect`.
- Cancel on unmount: `return () => { client.cancel() }`.

### `partial/Form.tsx` Rules:
- Receives three props: `mutation: UseMutation<Schema>`, `validation: UseZod<Schema>`, `onSubmit: () => void`.
- No data fetching — props only.
- Import `UseMutation` from `ezhooks/lib/useMutation` and `UseZod` from `@hooks/use-zod`.

---

## Schema Layer (`src/schemas/`)

**Read this file to understand the pattern:** `src/schemas/_schema.config.ts`

Rules:
- Always import zod through the config file, never raw:
  ```typescript
  import z from "@schemas/_schema.config";  // ✓
  import * as z from "zod";                // ✗
  ```
- Every schema file exports both the schema object and its inferred TypeScript type:
  ```typescript
  export const input{Model}Schema = z.object({ ... });
  export type Input{Model}Schema = z.infer<typeof input{Model}Schema>;
  ```
- Schema files contain Zod definitions only — no business logic, no API calls.
- Naming: `{action}{Model}Schema` (e.g. `inputProductSchema`, `filterProductSchema`).

---

## Hook Layer (`src/hooks/`)

**Read these files to understand available hooks:**
- `src/hooks/use-zod.ts` — Zod-based form validation
- `src/hooks/use-delete.ts` — delete confirmation with `useAlert`
- `src/hooks/use-dialog.ts` — multi-key dialog open/close state
- `src/hooks/use-popup.ts` — MUI Popover/Menu anchor state
- `src/hooks/use-image.ts` — image preview state (file or URL)
- `src/hooks/use-tab-link.ts` — MUI Tabs + react-router navigation
- `src/hooks/use-watch.ts` — reactive watch for `useApp` context changes

Rules:
- Custom hooks live in `src/hooks/`, filenames are `use-{name}.ts`.
- Hooks are reusable and UI-framework agnostic — no JSX inside hook files.
- Import from `@hooks/{name}` everywhere except within the same folder.

---

## Routing (`src/router.tsx`)

**Read this file to understand the pattern:** `src/router.tsx`

Rules:
- Use `createBrowserRouter` from `react-router`.
- Lazy-import all page components with `LoadComponent(() => import("@pages/..."))` — never static imports.
- Protected routes are children of the root `"/"` route which has the `loader` from `@services/auth.service`.
- Public (guest) routes are children of a `GuestLayout` element with no loader.
- Adding a new route: add as a child of the root `"/"` route object (inside the `children` array).
- Use `{ path: "*", element: <NotFoundPage /> }` as the catch-all — always keep it last.

---

## Error Handling

Rules:
- Use `useSnackbar` for success/error toast messages: `setSnackbar("...", { severity: "error" })`.
- Use `useAlert` for destructive action confirmation (delete, etc.) — never a browser `confirm()`.
- Handle API validation errors in `onError`:
  ```typescript
  onError: (e) => {
    if (e instanceof Response) {
      if (e.status === 422) {
        e.json().then((resp) => {
          validation.setError(ctm.parse(resp.error));
        });
      }
    }
  }
  ```
- `useParseError` (from `@hooks/use-parse-error`) maps BE error types (e.g. `exists`, `not_found`) to field messages — instantiate with `label` and `message` maps, then call `ctm.parse(resp.error)`.

---

## Component Rules (`src/components/`)

- `ui/` — global atomic components, reusable across the entire app (Button variants, Input, Dialog, Skeleton, Spinner…)
- `base/` — global composite components (DataTable, TableView, Dropdown, InputSelect…)
- `shared/` — components that are feature-specific but reusable across **more than one page/domain**
- `layouts/` — `AppLayout`, `GuestLayout` — wraps page groups in routing
- `templates/` — `PageTemplate` — standard page shell with title, back, reload, action buttons

For components used by **only one page**, place them in `partial/` inside that page's folder:
```
src/pages/{domain}/
  partial/
    Form.tsx        # shared between create + update within the same domain
    {Name}.tsx      # component used only by this page
```

Decision rule:
1. Used across the whole app → `src/components/ui/` or `src/components/base/`
2. Feature-specific, but reused across multiple pages/domains → `src/components/shared/`
3. Specific to one page only → `src/pages/{domain}/partial/`

Rules:
- Components receive data through props — never import services or call `api.*` inside components.
- Lazy-load heavy MUI components with `React.lazy` or `LoadComponent` — see `login.page.tsx` for example.
- MUI imports are always deep imports: `import Button from "@mui/material/Button"` not `import { Button } from "@mui/material"`.

---

## Constants Layer (`src/constants/`)

Rules:
- **Organization by type**: Group constants by their purpose, not by domain (organize by status, messages, alerts vs auth, user, product).
- **No hardcoded values**: All strings, numbers, enums, status codes, color values, and lookup arrays must be defined in constants files, never inline in components or pages.
- **English naming**: Use English for all constant names and default values for consistency, regardless of target language.
- **Typed exports**: Always export both the constant object and its TypeScript type using `as const` and `typeof` patterns.
- **Structured lookups**: For data that needs searching/filtering, use array of objects with consistent properties like `id`, `label`, `value`, `type`.
- **Enum-like objects**: Use object literals with `as const` instead of TypeScript enums for better tree-shaking and type inference.
- **Filename pattern**: Use `{purpose}.constant.ts` naming (http-status, alert, message, common, etc.)
- **Static data arrays**: Any data that is static and does not change at runtime (e.g. option lists, status lists, dropdown data, label maps, color maps) must be defined in `src/constants/`, **never inline in components, pages, or utility files**. Name using CAPITAL_CAPITAL convention, declare with `as const`, and export the inferred TypeScript type using `typeof`.
- **Enum constant pattern**: Every domain with an enum or lookup type **must** co-locate its related constants in the same constants file as the enum/type:
  - `{DOMAIN}_LABEL: Record<EnumType, string>` — human-readable labels for each value
  - `{DOMAIN}_OPTIONS: Array<{ primary: string; value: EnumType }>` — ready-to-use options for selects/dropdowns
  - Utility functions in `src/utils/` are **only** thin getter wrappers that import from constants — **never** define arrays or objects inside utility files
- **Status constant pattern**: Every domain with a status enum **must** define three constants and two utility functions:
  - `{DOMAIN}_STATUS_LABEL: Record<Status, string>` → in `label.constant.ts`
  - `{DOMAIN}_STATUS_COLOR: Record<Status, string>` → in `color.constant.ts`
  - `{DOMAIN}_STATUS_OPTIONS: Array<{ primary: string; value: Status }>` → in `status.constant.ts`
  - `get{Domain}StatusLabel(status)` → in `label.utils.ts`
  - `get{Domain}ColorByStatus(status)` → in `color.utils.ts`

  Never define status label maps, color maps, or options arrays inline inside pages or components.

---

## Commons Layer (`src/commons/`)

**File:** `src/commons/dummy.ts`

Rules:
- **Single file for all dummy data**: All default values, fallback objects, and placeholder data must be placed in `src/commons/dummy.ts` — never inline in pages, components, hooks, or services.
- **Default/initial form values**: Any object used as `defaultValue`, `initialValue`, or initial state for `useMutation`/`useZod` must be defined in `dummy.ts` and imported via `@commons/dummy`.
- **Naming convention**: Use the prefix `default` followed by PascalCase model name: `defaultUser`, `defaultProduct`, `defaultInputProduct`.
- **Typed with schema**: Dummy objects must be typed using the inferred schema type or domain type:
  ```typescript
  import type { InputProductSchema } from "@schemas/product.schema";

  export const defaultInputProduct: InputProductSchema = {
    name: "",
    price: 0,
    stock: 0,
  };
  ```
- **No logic**: `dummy.ts` contains only plain object/array literals — no functions, no imports from services or utils.
- **Import alias**: Always import from `@commons/dummy`, never via relative path (except within the same folder).
- **Usage in pages**: Pass dummy values as `defaultValue` to `useMutation` or as the initial data seed — never define bare object literals inline in the component body.

  ```typescript
  // ✓ correct
  import { defaultInputProduct } from "@commons/dummy";
  const mutation = useMutation({ defaultValue: defaultInputProduct });

  // ✗ wrong — inline object literal
  const mutation = useMutation({ defaultValue: { name: "", price: 0 } });
  ```

---

## Utilities Layer (`src/utils/`)

Rules:
- **No direct indexing**: Components must never access array/object data directly via indexing, `.find()`, `.at()`, or bracket notation. Always use utility functions.
- **Naming convention**: Use `get{Type}By{Property}` pattern for lookup functions (getStatusByCode, getColorByType, getMessageByKey).
- **Safe fallbacks**: All utility functions must provide default/fallback values via optional parameters, never return undefined or throw errors.
- **Pure functions**: Utilities should be stateless, take simple parameters, and return predictable results.
- **Import constants**: Utility files must import data from `@constants/*`, never define data arrays/objects locally within utility files.
- **Group by domain**: Create focused utility files per functional area (status, alert, message, date, validation, etc.).
- **Consistent return types**: Functions returning the same type of data should have consistent signatures and fallback patterns.
- **Parameter validation**: Handle invalid inputs gracefully by returning sensible defaults rather than breaking.

### Utility Function Patterns:
- **Simple lookup**: Function takes identifier, returns value with fallback
- **Type conversion**: Function takes raw input, returns typed/validated output  
- **Status checking**: Function takes state, returns boolean or status enum
- **Message formatting**: Function takes key/template, returns formatted string
- **Safe access**: Function replaces direct array/object access with error handling
