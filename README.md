# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

🧩 frgen – Form Generator CLI

`frgen` adalah CLI tool untuk meng-generate **halaman frontend** berbasis **MUI** dari file **JSON Schema**, seperti:

- Form (Create, Update, View)
- Validasi (Zod)
- Halaman Index
- Service API
- Dummy data
- Route
- TypeScript interface

---

🚀 Cara Penggunaan

Gunakan langsung dengan `npx`:

npx regen <action> [--file=path/to/schema.json] [--mui=mui]

📌 Parameter

| Parameter      | Default              | Keterangan                                                                 |
|----------------|----------------------|----------------------------------------------------------------------------|
| `action`       | *(required)*         | Aksi yang dijalankan (`make:page`, `make:dummy`, `make:route`)            |
| `--file`       | `json-schema.json`   | Path ke file JSON Schema                                                  |
| `--mui`        | `mui`                | UI framework (sementara hanya mendukung `mui`)                            |

---

🛠️ Aksi yang Tersedia

✅ `make:page`

Generate otomatis:

- `Form` (Create, Update, View)
- `IndexPage`
- `Service API`
- `Validation Zod`
- `TypeScript types`

npx regen make:page

🧪 `make:dummy`

Generate file dummy untuk masing-masing entitas:

npx regen make:dummy

🧭 `make:route`

Generate file route untuk semua entitas:

npx regen make:route

---

📂 Contoh File JSON Schema

File: `json-schema.json`

{
  "definitions": {
    "Product": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "price": { "type": "number" }
      },
      "required": ["id", "name", "price"]
    }
  }
}

---

💡 Contoh Penggunaan

# Generate semua page dari default schema
npx regen make:page

# Generate dummy dari file custom
npx regen make:dummy --file=./schemas/product.schema.json

# Generate routes
npx regen make:route

---

⚠️ Error Umum

- ❌ `action undefined.` → Lupa memberikan nama aksi
- ❌ `Unknown action` → Aksi yang dimasukkan salah
- ❌ `ERROR: ENOENT` → File JSON Schema tidak ditemukan