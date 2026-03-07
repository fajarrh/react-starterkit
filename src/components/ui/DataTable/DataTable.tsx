import React from "react";
import HeadRow, { HeadRowProps } from "./HeadRow";
import { CellProps } from "./HeadCell";
import TableHead from "@mui/material/TableHead";
import TableRow, { TableRowProps } from "@mui/material/TableRow";
import Table, { TableProps } from "@mui/material/Table";
import TableContainer, {
  TableContainerProps,
} from "@mui/material/TableContainer";
import { TablePaginationProps } from "@mui/material/TablePagination";
import RowLoading from "./RowLoading";
import TableBody from "@mui/material/TableBody";
import styled from "@emotion/styled";
import {
  default as MuiTableCell,
  TableCellProps,
} from "@mui/material/TableCell";
import { TextFieldProps } from "@mui/material/TextField";
import { FilterCellProps } from "./FilterCell";
import FilterRow from "./FilterRow";
import * as use from "@utils/array";
import LoadComponent from "../LoadComponent/LoadComponent";

const TablePagination = LoadComponent(
  () => import("@mui/material/TablePagination"),
);

export type ColumnProps<T> = CellProps & {
  filter?: Omit<FilterCellProps, "filterOptions">;
} & {
  value: (value: T, index?: number) => React.ReactNode;
  noWrap?: boolean;
} & TableCellProps;

export interface DataTableProps<T> extends Omit<HeadRowProps, "column"> {
  hover?: boolean;
  pagination?: TablePaginationProps;
  container?: TableContainerProps;
  row?: TableRowProps;
  filterOptions?: TextFieldProps;
  tableProps?: TableProps;
  column: ColumnProps<T>[];
  loading?: boolean;
  data: T[];
  emptyText?: React.ReactNode;
  emptyCellText?: string;
  responsive?: boolean;
  renderSmallView?: (
    value: T,
  ) => TableCellProps & { headProps?: TableCellProps };
  selected?: (value: T) => boolean;
}

const TableCell = styled(MuiTableCell)(() => ({
  padding: "8px 16px",
}));

const DataTable = <T=any,>({
  loading,
  order,
  orderBy,
  column,
  data,
  onOrder,
  selected,
  emptyText,
  emptyCellText,
  pagination,
  hover,
  container,
  row,
  headRowProps,
  tableProps,
  filterOptions,
  responsive,
  renderSmallView,
}: DataTableProps<T>): React.JSX.Element => {
  const cdata = React.useMemo(
    () =>
      column.map((value) =>
        use.omit(value, ["head", "label", "sortKey", "filter"]),
      ),
    [column, data],
  );

  const cfilter = React.useMemo(
    () => column.map((value) => value.filter),
    [column, data],
  );

  const chead = React.useMemo(
    () => column.map((value) => use.pick(value, ["label", "sortKey", "head"])),
    [column, data],
  );

  return (
    <TableContainer {...container}>
      <Table
        stickyHeader
        {...tableProps}
        sx={{
          "& thead > tr:first-of-type > th": {
            backgroundColor: "grey.200",
            whiteSpace: "nowrap",
          },
          "& thead > tr:nth-of-type(2) > th": {
            backgroundColor: "grey.100",
            whiteSpace: "nowrap",
          },
          "& tbody > tr": {
            opacity: 0,
            animation: "fadein 1s forwards",
          },
          "@keyframes fadein": {
            to: {
              opacity: 1,
            },
          },
          ...(tableProps && tableProps.sx ? { ...tableProps.sx } : undefined),
        }}
      >
        {responsive ? null : (
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
            <HeadRow
              order={order}
              orderBy={orderBy}
              column={chead}
              onOrder={onOrder}
              headRowProps={headRowProps}
            />
            {!!cfilter.length && cfilter.some((v) => v !== undefined) ? (
              <FilterRow column={cfilter} filterOptions={filterOptions} />
            ) : null}
          </TableHead>
        )}

        <TableBody component={"tbody"}>
          {loading ? (
            <RowLoading count={responsive ? 1 : column.length} />
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell variant="body" colSpan={column.length} align="center">
                {emptyText ?? "Data not available"}
              </TableCell>
            </TableRow>
          ) : (
            data.map((_data: T, i: number) =>
              responsive ? (
                <TableRow
                  key={`row-${i}`}
                  component="tr"
                  hover={hover}
                  selected={selected ? selected(_data) : undefined}
                  style={{ animationDelay: `${i * 0.02}s` }}
                  {...row}
                >
                  <TableCell
                    {...use.omit(renderSmallView(_data), ["headProps"])}
                  />
                </TableRow>
              ) : (
                <TableRow
                  key={`row-${i}`}
                  component="tr"
                  hover={hover}
                  selected={selected ? selected(_data) : undefined}
                  {...row}
                >
                  {cdata.map(({ value, noWrap, ...col }, j) => (
                    <TableCell key={`row-${i}-cell-${j}`} {...col}>
                      {value(_data, i) || emptyCellText || "N/A"}
                    </TableCell>
                  ))}
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>

      {pagination ? (
        <React.Suspense fallback={"loading..."}>
          <TablePagination
            component="div"
            sx={{
              bottom: responsive ? "56px" : 0,
              backgroundColor: "#f5f5f5",
            }}
            {...pagination}
          />
        </React.Suspense>
      ) : null}

      
    </TableContainer>
  );
};

export default DataTable;
