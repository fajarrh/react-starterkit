---
applyTo: "src/**"
---

# Frontend Layer Instructions

These rules apply whenever you create or edit files in `src/`. Always read the referenced pattern files before generating new code.

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
