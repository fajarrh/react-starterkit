import { responsiveFontSizes, createTheme } from "@mui/material/styles";

// declare module "@mui/material/styles" {
//   interface Palette {
//     order?: Palette["primary"];
//   }

//   interface PaletteOptions {
//     order?: PaletteOptions["primary"];
//   }
// }

// declare module "@mui/material/Chip" {
//   interface ChipPropsColorOverrides {
//     order: true;
//   }
// }

let defaultTheme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "unset",
          whiteSpace: "nowrap",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
        disableElevation: true,
      },
    },
    MuiTab: {
      defaultProps: {
        sx: {
          textTransform: "unset",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "8px 16px 8px 16px",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
      styleOverrides: {
        root: {
          // "& .MuiInputBase-root": {
          //   // backgroundColor: "#f4f4f4",
          //   // borderRadius: "8px",
          // },
          // "& .MuiOutlinedInput-notchedOutline": {
          //   // borderRadius: "12px",
          // },
        },
      },
    },
  },
});

defaultTheme = responsiveFontSizes(defaultTheme);
export default defaultTheme;
