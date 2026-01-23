/**
 *
 * @param {*} columns
 * @param {*} modelName
 * @description Template for index page
 * @returns {string} Template string
 */

import * as helper from "./_helper.template.js";

export default function indexTemplate({ columns, modelName }) {
  const serviceName = `${helper.toKebabCase(modelName)}.service`;
  const funcName = helper.toPascalCase(modelName);

  const columnTable = columns.map(({ key, type, ...other }) => {
    const filter = {
      type: `type: "text"`,
      value: `value: table.query("${key}", "")`,
      options: `options: { placeholder: "Search..." }`,
      onChange: `onChange: (e) => table.setQuery({ ${key}: e.target.value })`,
    };

    let col = `
      label: "${helper.toPascalWithSpace(key)}",
      sortKey: "${key}",
      value: (v) => v.${key},
    `;

    if (helper.isNumber(type)) {
      filter.onChange = `onChange: (e) => table.setQuery({ ${key}: +e.target.value })`;
    } else if (helper.isBoolean(type)) {
      filter.type = `type: "select"`;
      filter.value = `value: table.query("${key}", "00")`;
      filter.onChange = `onChange: (e) => {table.setQuery({ ${key}: e.target.value === "00" ? "" : e.target.value })}`;
      filter.items = `items: [{ primary: "Yes", value: true },{ primary: "No", value: false }]`;
    } else {
      if (other?.format && helper.isDate(other.format)) {
        filter.type = `type: "date"`;
      }

      if (other?.enum) {
        filter.type = `type: "select"`;
        filter.value = `value: table.query("${key}", "00")`;
        filter.onChange = `onChange: (e) => {table.setQuery({ ${key}: e.target.value === "00" ? "" : e.target.value })}`;
        const items = other.enum.map((v) => {
          return `{ primary: "${helper.toPascalWithSpace(v)}", value: "${v}" }`;
        });
        filter.items = `items: [${items.join(", ")}]`;
      }
    }

    return `{ 
      ${col} 
      filter: {
        ${Object.values(filter).join(",\n")}
      }
    }`;
  });

  return `
import React from "react
import PageTemplate from "@components/templates/PageTemplate";
import DataTablePage from "@components/base/DataTable/DataTablePage";
import Dropdown from "@components/base/Dropdown/Dropdown";
import useTable from "ezhooks/lib/useTable";
import { get${funcName}, delete${funcName} } from "@services/${serviceName}";

import { getPagination } from "@utils/table";
import { useNavigate } from "react-router";
import { useAlert } from "@contexts/AlertContext";
import { useSnackbar } from "@contexts/SnackbarContext";

const Page = () => {
  const navigate = useNavigate();
  const alert = useAlert();
  const { setSnackbar } = useSnackbar();

  const table = useTable({
    service: get${funcName},
    selector: (resp) => resp.data,
    total: (resp) => resp.total,
    replaceUrl: true,
    pagination: {
      startPage: 0,
    },
  });

  const onClickEdit = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const value = e.currentTarget.value;
    navigate(\`\/edit/\${value}\`\);
  };

  const onClickView = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const value = e.currentTarget.value;
    navigate(\`\/view/\${value}\`\);
  };

  const onClickDelete = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const value = e.currentTarget.value;
    alert.set({
      open: true,
      title: "Delete Confirmation",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      type: "warning",
      confirm: {
        onClick: () => {
          alert.set({ loading: true });
          delete${funcName}({ params: { id: value } })
            .then(() => {
              setSnackbar("Data has been successfully deleted.");
              alert.reset();
              table.reload();
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

  return (
    <PageTemplate title="${funcName} Page" onReload={table.reload}>
      <DataTablePage
        tableProps={{ size: "small" }}
        loading={table.loading}
        onOrder={table.onSort}
        order={table.order}
        orderBy={table.orderBy}
        column={[
          ${columnTable.join(",\n")},
          {
            label: "",
            value: (v) => (
              <Dropdown
                menu={[
                  { text: "View", value: v.id, onClick: onClickView },
                  { text: "Edit", value: v.id, onClick: onClickEdit },
                  { text: "Delete", value: v.id, onClick: onClickDelete },
                ]}
              />
            ),
            head: {
              padding: "checkbox",
            },
          },
        ]}
        data={table.data}
        pagination={getPagination(table.pagination)}
      />
    </PageTemplate>
  );
};

export default Page;`;
}
