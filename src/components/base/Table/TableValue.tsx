import Skeleton from "@mui/material/Skeleton";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

type TableValueProps = {
  label: string;
  loading: boolean;
  isPending?: boolean;
  children?: React.ReactNode;
  valueProps?: TableCellProps;
};

const TableValue = (props: TableValueProps) => {
  return (
    <TableRow>
      <TableCell
        padding="checkbox"
        sx={{
          fontWeight: 500,
        }}
      >
        {props.label}
      </TableCell>
      <TableCell padding="none" align="center" sx={{ fontWeight: 500 }}>
        :
      </TableCell>
      <TableCell {...props.valueProps}>
        {props.loading ? (
          <Skeleton width={"100%"} variant="text" />
        ) : props.isPending ? (
          <Typography variant="caption" fontStyle="italic">
            Memuat data...
          </Typography>
        ) : (
          props.children
        )}
      </TableCell>
    </TableRow>
  );
};

export default TableValue;
