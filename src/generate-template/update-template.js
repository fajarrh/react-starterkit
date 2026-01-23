/**
 *
 * @param {*} jsonSchema
 * @param {*} modelName
 * @description Template for update page
 * @returns {string} Template string
 */

import * as helper from "./_helper.template.js";

export default function updateTemplate({ jsonSchema, modelName }) {
  const serviceName = `${helper.toKebabCase(modelName)}.service`;
  const funcName = helper.toPascalCase(modelName);
  const pageName = helper.toPascalWithSpace(modelName);
  const schemaFileName = `${helper.toKebabCase(modelName)}.schema`;

  return `
import React from "react";
import PageTemplate from "@components/templates/PageTemplate";
import Box from "@mui/material/Box";
import Form from "./partial/Form";
import Toolbar from "@mui/material/Toolbar";
import useMutation from "ezhooks/lib/useMutation";
import useZod from "@hooks/useZod";
import { input${funcName}Schema } from "@schemas/${schemaFileName}";
import { put${funcName}, get${funcName}ID } from "@services/${serviceName}";
import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "@contexts/SnackbarContext";
import { input${funcName} } from "@commons/dummy";

const Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSnackbar } = useSnackbar();

  const mutation = useMutation({
    defaultValue: input${funcName},
  });

  const validation = useZod({
    data: mutation.data,
    schema: input${funcName}Schema(z).extend({ id: z.number() }),
  });

  const onSubmit = () => {
    const validated = validation.validated();
    if (validated) {
      mutation.send({
        service: put${funcName},
        onSuccess: () => {
          setSnackbar("Your changes have been saved successfully.");
          mutation.reset();
          const timer = setTimeout(() => {
            navigate(-1);
            clearTimeout(timer);
          }, 2000);
        },
      });
    }
  };

  const fetchData = () => {
    mutation.send({
      service: get${funcName}ID(+id),
      onSuccess: (resp) => {
        mutation.setData(resp.data);
      },
    });
  };

  React.useEffect(() => {
    if (!id) return;
    fetchData();
    return () => {
      mutation.cancel();
    };
  }, [id]);

  return (
    <PageTemplate title="Update ${pageName}" onBack={() => navigate(-1)}>
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
