/**
 *
 * @param {*} columns
 * @param {*} modelName
 * @description Template for view page
 * @returns {string} Template string
 */

import * as helper from "./_helper.template.js";

export default function viewTemplate({ columns, modelName }) {
  const serviceName = `${helper.toKebabCase(modelName)}.service`;
  const funcName = helper.toPascalCase(modelName);
  const pageName = helper.toPascalWithSpace(modelName);
  const columnTable = columns.map(({ key, type }) => {
    return `{ 
      label: "${helper.toPascalWithSpace(key)}",
      value: (v) => v.${key},
    }`;
  });

  return `
import React from "react";
import PageTemplate from "@components/templates/PageTemplate";
import TableView from "@components/base/Table/TableView";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar"

import { get${funcName}ID, delete${funcName} } from "@services/${serviceName}";
import { useNavigate, useParams } from "react-router";
import { useAlert } from "@contexts/AlertContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import useRequest from "ezhooks/lib/useRequest";

const Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const { setSnackbar } = useSnackbar();

  const client = useRequest({ data: {} });

  const onClickEdit = () => {
    navigate(\`\/edit/\${id}\`\);
  };

  const onClickDelete = () => {
    alert.set({
      open: true,
      title: "Delete Confirmation",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      type: "warning",
      confirm: {
        onClick: () => {
          alert.set({ loading: true });
          delete${funcName}({ params: { id: +id } })
            .then(() => {
              setSnackbar("Data has been successfully deleted.");
              alert.reset();
              const timer = setTimeout(() => {
                navigate("/example");
                clearTimeout(timer);
              }, 1500);
            })
            .catch((e) => {
              setSnackbar(e?.message, { severity: "error" });
            })
            .finally(() => {
              alert.set({ loading: false });
            });
        },
      },
    });
  };

  const fetchData = () => {
    client.exec({
      service: get${funcName}ID(+id),
      onSuccess: (data) => {
        return data.data;
      },
    });
  };

  React.useEffect(() => {
    if (!id) return;
    fetchData();

    return () => {
      client.cancel();
    };
  }, [id]);

  return (
    <PageTemplate 
    title="View ${pageName}" 
    onBack={() => navigate(-1)}
    onUpdate={onClickEdit}
    onDelete={onClickDelete}
    onReload={fetchData}
    >
     <Box sx={{ overflow: "hidden auto", minHeight: "100%" }}>
        <TableView
          loading={client.loading}
          data={client.data}
          column={[
            ${columnTable.join(",\n")}
          ]}
        />

        <Toolbar />
        <Toolbar />
      </Box>
    </PageTemplate>
  );
};

export default Page;`;
}
