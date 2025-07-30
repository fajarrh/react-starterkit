# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.


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

- Form (Create, Update, View)
- IndexPage
- Service API
- Validation Zod
- TypeScript types

Contoh:
  npx regen make:page

🧪 `make:dummy`

Generate file dummy untuk masing-masing entitas:

Contoh:
  npx regen make:dummy

🧭 `make:route`

Generate file route untuk semua entitas:

Contoh:
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


---

🔄 Konversi Prisma ke JSON Schema

Jika kamu menggunakan Prisma, kamu bisa convert Prisma Schema ke JSON Schema secara otomatis menggunakan:

🔗 https://www.npmjs.com/package/prisma-json-schema-generator

Langkah:
1. Install generator:
   npm install -D prisma-json-schema-generator

2. Tambahkan ke `schema.prisma`:
   generator jsonSchema {
     provider = "prisma-json-schema-generator"
   }

3. Jalankan:
   npx prisma generate

4. File JSON Schema akan tersedia di: `prisma/json-schema/json-schema.json`

5. Gunakan dengan frgen:
   masukkan file kedalam root folder atau gunakan `--file=path-to-json-schema`
