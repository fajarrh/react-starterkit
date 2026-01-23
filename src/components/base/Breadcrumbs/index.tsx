import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { default as MUIBreadcrumbs } from "@mui/material/Breadcrumbs";
import { Link as RLink, useLocation } from "react-router";
import { snackCaseToWord } from "@utils/string";
import Box from "@mui/material/Box";

const Breadcrumbs = () => {
  const location = useLocation();

  const render = (links: string) => {
    const paths = links.split("/");
    const first = paths.at(0);
    const last = paths.pop();
    let url = "";

    const temp = paths.map((v) => {
      if (v === "") {
        v = "Home";
        url = `${window.location.protocol}//${window.location.host}`;
      } else if (last === v) {
        url += v;
      } else {
        url += `${v}`;
      }
      return (
        <Link
          key={v}
          component={RLink}
          underline="hover"
          color="inherit"
          to={url}
          fontSize={"small"}
        >
          {snackCaseToWord(v)}
        </Link>
      );
    });

    if (first !== last) {
      temp.push(
        <Typography key={paths.length} fontSize={"small"} color="disabled">
          {snackCaseToWord(last)}
        </Typography>
      );
    }

    return temp;
  };

  const url = React.useMemo(() => render(location.pathname), [location]);
  return (
    <Box
      role="presentation"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <MUIBreadcrumbs separator={"›"} maxItems={4} aria-label="breadcrumb">
        {url}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
