/**
 *
 * @param {*} jsonSchema
 * @param {*} modelName
 * @description Template for form page
 * @returns {string} Template string
 */

import { de } from "zod/v4/locales";
import * as helper from "./_helper.template.js";

export default function formTemplate({ jsonSchema, modelName }) {
  const inputSchemaTS = `Input${helper.toPascalCase(modelName)}Schema`;
  const importFile = `import {${inputSchemaTS}} from '@schemas/${helper.toKebabCase(modelName)}.schema';`;
  let importSelect = ""

  let forms = [];
  for (let [key, property] of Object.entries(jsonSchema.properties)) {
    if (key === "id") continue;
    const types = Array.isArray(property.type)
      ? property.type
      : [property.type];

    let html = "";
    for (const element of types) {
      const isSelect = property.enum || helper.isBoolean(element);
      const label = helper.toPascalWithSpace(key);
      const placeholder = `Please input ${helper.toPascalWithSpace(key).toLowerCase()}`;
      const textField = {
        label: `label="${label}"`,
        name: `name="${key}"`,
        type: `type="text"`,
        variant: `variant="standard"`,
        placeholder: `placeholder="${placeholder}"`,
        required: `required={${(jsonSchema.required ?? []).includes(key)}}`,
        value: `value={mutation.value("${key}", "")}`,
        onChange: `onChange={(e) => mutation.setData({${key}: e.target.value })}`,
        slotProps: `slotProps={{ inputLabel: { shrink: true } }}`,
        disabled: `disabled={mutation.processing}`,
        error: `error={validation.error("${key}")}`,
        helperText: `helperText={validation.message("${key}")}`,
      };

      if (helper.isNumber(element)) {
        textField.type = `type="number"`;
        textField.onChange = `onChange={(e) => mutation.setData({${key}: +e.target.value })}`;
      } else if (isSelect) {
        importSelect = `import InputSelect from "@components/base/Input/InputSelect";`;
        delete textField.type;
        delete textField.placeholder;
        textField.selectText = `selectText="Choose one"`;
        textField.onChange = `onChange={(e) => mutation.setData({${key}: e.target.value === "00" ? "" : e.target.value })}`;
        textField.slotProps = `slotProps={{
          inputLabel: { shrink: true },
          select: { native: true },
        }}`;
        textField.items = `items={[{ primary: "Yes", value: true },{ primary: "No", value: false }]}`;
        if (property.enum) {
          textField.items = `items={[${property.enum
            .map(
              (v) =>
                `{ primary: "${helper.toPascalWithSpace(v)}", value: "${v}" }`
            )
            .join(", ")}]`;
        }
      } else {
        if (property.format && helper.isDate(property.format)) {
          textField.type = `type="date"`;
        }
      }

      html = isSelect
        ? `<InputSelect
        ${Object.values(textField).join("\n        ")}
      />`
        : `<TextField
        ${Object.values(textField).join("\n        ")}
      />`;
    }
    forms.push(html);
  }

  return `
import Stack from "@mui/material/Stack";
import LoadComponent from "@components/base/LoadComponent/LoadComponent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
${importSelect}
import { UseZod } from "@hooks/use-zod";
import { UseMutation } from "ezhooks/lib/useMutation";
${importFile}

const TextField = LoadComponent(() => import("@mui/material/TextField"));

type Props = {
  mutation: UseMutation<${inputSchemaTS}>;
  validation: UseZod<${inputSchemaTS}>;
  onSubmit: () => void;
};
const Form = ({ mutation, validation, onSubmit }: Props) => {
  return (
    <Stack
      direction={"column"}
      spacing={2.5}
      sx={{ margin: "0px auto", width: "50%", p: 3 }}
    >
      <Stack spacing={1}>
        <Typography component={"div"} variant="h6">
          Form ${helper.toPascalWithSpace(modelName)}
        </Typography>

        <Divider />
      </Stack>

      ${forms.join(" \n")}

      <Stack direction={"row"}>
        <div>
          <Button
            loading={mutation.processing}
            disabled={mutation.processing}
            size="small"
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

export default Form;`;
}
