import TableValue from "@components/base/Table/TableValue";
import { TableCellProps } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer, {
  TableContainerProps,
} from "@mui/material/TableContainer";

type Props<T = any> = {
  isMobile?: boolean;
  loading?: boolean;
  isPending?: boolean;
  data: T;
  column: Array<{
    label: string;
    value: (value: T) => any;
    valueProps?: TableCellProps;
  }>;
  containerProps?: TableContainerProps;
};

const TableView = ({
  isMobile,
  isPending,
  loading,
  data,
  column,
  containerProps,
}: Props) => {
  return (
    <TableContainer {...containerProps}>
      <Table
        size="small"
        className="main-table"
        sx={{
          "& tbody > tr > td:first-of-type": {
            whiteSpace: "nowrap",
          },

          ...(isMobile && {
            "& tbody > tr": {
              display: "flex",
              flexDirection: "column",

              "& td": {
                display: "block",
              },
              "& td:nth-of-type(2)": {
                display: "none",
              },

              "& .MuiTableCell-paddingCheckbox": {
                width: "100%",
                py: 1,
              },
            },
          }),
        }}
      >
        <TableBody>
          {column.map((r, i) => (
            <TableValue
              key={i}
              loading={loading}
              label={r.label}
              isPending={isPending}
              valueProps={r.valueProps}
            >
              {r.value(data)}
            </TableValue>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
