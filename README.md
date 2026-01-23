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


# Regen

A powerful code generator that creates pages, forms, services, and validation files from JSON Schema definitions.

## Features

- 🚀 Generate complete CRUD pages automatically
- 📝 Create forms from JSON Schema
- ✅ Generate validation files
- 🔄 Create service layers
- 🎨 Support for custom templates
- 📊 Generate dummy data
- 🛣️ Auto-generate routes

## Installation

```bash
npm install regen
# or
yarn add regen
```

## Quick Start

1. Create a `json-schema.json` file in your project root:

```json
{
  "definitions": {
    "User": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string" },
        "age": { "type": "number" }
      },
      "required": ["name", "email"]
    }
  }
}
```

2. Run the generator:

```bash
npx regen make:page
```

## Commands

### `make:page`

Generate all pages, forms, services, and validation files for all entities in your schema.

```bash
npx regen make:page
```

### `make:dummy`

Generate dummy data for testing purposes.

```bash
npx regen make:dummy
```

### `make:route`

Generate route configuration file.

```bash
npx regen make:route
```

### `make:validation`

Generate validation files only.

```bash
npx regen make:validation
```

### `make:form`

Generate form components only.

```bash
npx regen make:form
```

## Options

### `--file=<path>`

Specify a custom path to your JSON schema file.

```bash
npx regen make:page --file=./schemas/my-schema.json
```

**Default:** `./json-schema.json`

### `--template=<directory>`

Use custom templates from a directory. The directory should contain:
- `index-template.js`
- `form-template.js`
- `view-template.js`
- `create-template.js`
- `update-template.js`

```bash
npx regen make:page --template=./my-templates
```

### Individual Template Options

You can also specify individual templates:

```bash
npx regen make:page --index-template=./templates/custom-index.js
npx regen make:page --form-template=./templates/custom-form.js
npx regen make:page --view-template=./templates/custom-view.js
npx regen make:page --create-template=./templates/custom-create.js
npx regen make:page --update-template=./templates/custom-update.js
```

### `--ignore=<templates>`

Skip generating specific files. Available options: `create`, `update`, `view`, `form`, `index`, `service`, `validation`, `dummy`

```bash
# Skip dummy data and validation
npx regen make:page --ignore=dummy,validation

# Skip all page templates, only generate services
npx regen make:page --ignore=create,update,view,form,index
```

## Configuration File

Create a `regen.config.js` file in your project root for persistent configuration:

```javascript
export default {
  jsonSchemaFile: "./schemas/schema.json",
  templateDir: "./templates",
  ignoreTemplate: ["dummy", "validation"],
  schemaImportStatement: "import { schema } from './schema'"
};
```

### Configuration Options

- **jsonSchemaFile**: Path to JSON schema file
- **templateDir**: Directory containing template files
- **ignoreTemplate**: Array of templates to skip
- **schemaImportStatement**: Custom import statement for schema

## Examples

### Generate everything with default settings

```bash
npx regen make:page
```

### Generate with custom schema file

```bash
npx regen make:page --file=./api-schema.json
```

### Generate with custom templates

```bash
npx regen make:page --template=./custom-templates
```

### Generate without dummy data and validation

```bash
npx regen make:page --ignore=dummy,validation
```

### Generate only dummy data

```bash
npx regen make:dummy
```

### Generate only routes

```bash
npx regen make:route
```

## Generated Files

When you run `make:page`, Regen generates the following structure for each entity:

```
src/
├── pages/
│   └── [EntityName]/
│       ├── index.tsx          # List/Index page
│       ├── create.tsx         # Create page
│       ├── update.tsx         # Update page
│       └── view.tsx           # View/Detail page
├── components/
│   └── forms/
│       └── [EntityName]Form.tsx
├── services/
│   └── [entityName]Service.ts
├── validation/
│   └── [entityName]Validation.ts
└── dummy/
    └── [entityName]Dummy.ts
```

## Help

Display help information:

```bash
npx regen --help
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.