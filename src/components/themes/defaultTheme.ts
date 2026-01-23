import { responsiveFontSizes, createTheme } from "@mui/material/styles";
import defaultToken from "./defaultToken";

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
  palette: {
    mode: "light",

    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.9)",
      secondary: "rgba(0, 0, 0, 0.65)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily:
      '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3333,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4444,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5714,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.4286,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.3846,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
      lineHeight: 1.4286,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.3333,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      lineHeight: 1.3333,
    },
  },
  shape: {
    borderRadius: defaultToken.borderRadius.medium,
  },
  shadows: [
    "none",
    defaultToken.shadow[2],
    defaultToken.shadow[4],
    defaultToken.shadow[4],
    defaultToken.shadow[8],
    defaultToken.shadow[8],
    defaultToken.shadow[8],
    defaultToken.shadow[8],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[16],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[28],
    defaultToken.shadow[64],
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: 4,
            "&:hover": {
              background: "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.medium,
          padding: "5px 12px",
          minHeight: 32,
          fontWeight: 600,
          transition: `all ${defaultToken.duration.fast} ${defaultToken.curve.easy}`,
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: defaultToken.shadow[4],
          },
        },
        outlined: {
          borderWidth: 1,
          "&:hover": {
            borderWidth: 1,
          },
        },
        sizeSmall: {
          // padding: '3px 8px',
          // minHeight: 24,
          fontSize: "0.8125rem",
        },
        sizeLarge: {
          padding: "8px 20px",
          minHeight: 40,
          fontSize: "0.9375rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.medium,
          transition: `all ${defaultToken.duration.fast} ${defaultToken.curve.easy}`,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: defaultToken.borderRadius.medium,
            transition: `all ${defaultToken.duration.fast} ${defaultToken.curve.easy}`,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.4)",
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.medium,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.16)",
            transition: `border-color ${defaultToken.duration.fast} ${defaultToken.curve.easy}`,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.4)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
        input: {
          padding: "8.5px 12px",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        select: {
          borderRadius: defaultToken.borderRadius.medium,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          transition: `box-shadow ${defaultToken.duration.normal} ${defaultToken.curve.easy}`,
        },
        elevation0: {
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
        elevation1: {
          boxShadow: defaultToken.shadow[2],
        },
        elevation2: {
          boxShadow: defaultToken.shadow[4],
        },
        elevation4: {
          boxShadow: defaultToken.shadow[8],
        },
        elevation8: {
          boxShadow: defaultToken.shadow[16],
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.large,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          // transition: `all ${defaultToken.duration.normal} ${defaultToken.curve.easy}`,
          // '&:hover': {
          //   boxShadow: defaultToken.shadow[8],
          //   borderColor: 'rgba(0, 0, 0, 0.12)',
          // },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.medium,
          fontWeight: 600,
          fontSize: "0.8125rem",
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: defaultToken.borderRadius.medium,
          borderWidth: 1,
          borderStyle: "solid",
        },
        standardError: {
          backgroundColor: "#fde7e9",
          borderColor: "#d13438",
          color: "#922327",
        },
        standardWarning: {
          backgroundColor: "#fff4ce",
          borderColor: "#f7630c",
          color: "#ac4508",
        },
        standardInfo: {
          backgroundColor: "#e1f5fe",
          borderColor: "#0078d4",
          color: "#005494",
        },
        standardSuccess: {
          backgroundColor: "#e8f5e9",
          borderColor: "#0e7f0e",
          color: "#0a590a",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: defaultToken.borderRadius.large,
          boxShadow: defaultToken.shadow[28],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 600,
          padding: "20px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0 24px 20px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderRadius: defaultToken.borderRadius.small,
          fontSize: "0.75rem",
          padding: "4px 8px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 20,
          padding: 0,
          "& .MuiButtonBase-root ": {
            padding: 2,
          },
        },
        switchBase: {
          padding: 2,
          "&.Mui-checked": {
            transform: "translateX(20px)",
          },
        },
        thumb: {
          width: 16,
          height: 16,
        },
        track: {
          borderRadius: defaultToken.borderRadius.circular,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          minHeight: 48,
          transition: `color ${defaultToken.duration.fast} ${defaultToken.curve.easy}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: defaultToken.borderRadius.small,
        },
      },
    },
  },
});

defaultTheme = responsiveFontSizes(defaultTheme);
export default defaultTheme;
