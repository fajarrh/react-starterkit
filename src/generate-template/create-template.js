/**
 *
 * @param {*} jsonSchema
 * @param {*} modelName
 * @description Template for create page
 * @returns {string} Template string
 */

import * as helper from "./_helper.template.js";

export default function createTemplate({ jsonSchema, modelName }) {
  const serviceName = `${helper.toKebabCase(modelName)}.service`;
  const funcName = helper.toPascalCase(modelName);
  const pageName = helper.toPascalWithSpace(modelName);
  const schemaFileName = `${helper.toKebabCase(modelName)}.schema`;

  return `
import PageTemplate from "@components/templates/PageTemplate";
import Box from "@mui/material/Box";
import Form from "./partial/Form";
import Toolbar from "@mui/material/Toolbar";
import useMutation from "ezhooks/lib/useMutation";
import useZod from "@hooks/use-zod";
import { input${funcName}Schema } from "@schemas/${schemaFileName}";
import { post${funcName} } from "@services/${serviceName}";
import { useNavigate } from "react-router";
import { useSnackbar } from "@contexts/SnackbarContext";
import { input${funcName} } from "@commons/dummy";

const Page = () => {
  const navigate = useNavigate();
  const { setSnackbar } = useSnackbar();

  const mutation = useMutation({
    defaultValue: input${funcName},
  });

  const validation = useZod({
    data: mutation.data,
    schema: input${funcName}Schema,
  });

  const onSubmit = () => {
    const validated = validation.validated();
    if (validated) {
      mutation.send({
        service: post${funcName},
        onSuccess: () => {
          setSnackbar("Data has been successfully added.");
          mutation.reset();
          const timer = setTimeout(() => {
            navigate(-1);
            clearTimeout(timer);
          }, 2000);
        },
      });
    }
  };

  return (
    <PageTemplate title="Create ${pageName}" onBack={() => navigate(-1)}>
      <Box
        sx={{
          overflow: "hidden auto",
          minHeight: "100%",
          position: "relative",
        }}
      >
        <Form mutation={mutation} validation={validation} onSubmit={onSubmit} />
        <Toolbar />
        <Toolbar />
      </Box>
    </PageTemplate>
  );
};

export default Page;
    `;
}
