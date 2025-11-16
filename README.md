# regen CLI Tool

`regen` is a Node.js-based code generator designed to create pages, forms, routes, services, validation schemas (Zod), dummy data, and TypeScript definitions based on a JSON Schema file. It supports customizable templates and MUI components.

---

# Converting Prisma Schema to JSON Schema

If you are working with Prisma, you can automatically convert your Prisma schema into a JSON Schema using the following package:

🔗 https://www.npmjs.com/package/prisma-json-schema-generator

## Steps

### 1. Install the generator

```bash
npm install -D prisma-json-schema-generator
```

### 2. Add the generator configuration to your `schema.prisma`

```prisma
generator jsonSchema {
  provider              = "prisma-json-schema-generator"
  includeRequiredFields = "true"
}
```

This setup enables Prisma to generate a well-structured JSON Schema based on your models.  
You can then use the generated schema with the `regen` CLI to automate creation of pages, forms, services, validations, and more.


## 📦 Installation

You can run it directly using `npx`:

```bash
npx regen <action> [options]
```

---

## 🚀 Usage

### Basic Command Format

```bash
npx regen <action> [options]
```

---

## 🛠 Available Actions

### **1. `make:page`**
Generates all pages and services for every definition inside `json-schema.json`.

This includes:
- Service file
- Validation file
- Form component
- Index page
- Create page
- Update page
- View page
- Dummy data
- TypeScript definitions

```bash
npx regen make:page
```

---

### **2. `make:dummy`**
Generates only dummy data based on schema.

```bash
npx regen make:dummy
```

---

### **3. `make:route`**
Generates route file for all schema definitions.

```bash
npx regen make:route
```

---

### **4. `make:validation`**
Generates validation files only.

```bash
npx regen make:validation
```

---

### **5. `make:form`**
Generates form components only.

```bash
npx regen make:form
```

---

### **6. `--help`**
Shows help message.

```bash
npx regen --help
```

---

## ⚙ Options

### `--file=<path>`
Specify JSON schema file.

Default: `./json-schema.json`

```bash
npx regen make:page --file=./schema/user.json
```

---

### `--mui`
Use MUI templates (default).

```bash
npx regen make:page --mui
```

---

### Custom Template Options

| Option | Description |
|--------|-------------|
| `--index-template=<path>` | Custom index page template |
| `--form-template=<path>` | Custom form template |
| `--view-template=<path>` | Custom view template |
| `--create-template=<path>` | Custom create page template |
| `--update-template=<path>` | Custom update page template |
| `--template=<dir>` | Directory containing all templates |

Example:

```bash
npx regen make:page --template=./custom-templates
```

This expects:

```
custom-templates/
  index-template.js
  form-template.js
  view-template.js
  create-template.js
  update-template.js
```

---

### `--ignore=<templates>`

Comma-separated list of templates to skip.

Options:
- create
- update
- view
- form
- index
- service
- validation
- dummy

Example:

```bash
npx regen make:page --ignore=form,view
```

---

## 📂 JSON Schema Requirements

Your `json-schema.json` must have:

```json
{
  "definitions": {
    "User": {
      "properties": { ... },
      "required": [ ... ]
    }
  }
}
```

Each key inside `definitions` is treated as a module to generate.

---

## 🛑 Error Handling

Errors will be shown as:

```
❌ ERROR: <message>
```

---

## 📜 License

MIT License
