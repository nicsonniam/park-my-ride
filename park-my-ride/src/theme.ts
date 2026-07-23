import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F9FC73",
      contrastText: "#000000",
    },

    secondary: {
      main: "#171717",
      contrastText: "#F3F3F3",
    },

    background: {
      default: "#E8E8E8",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#000000",
      secondary: "#666666",
    },

    error: {
      main: "#D34444", 
    },

    warning: {
      main: "#FFA500",
    },

    success: {
      main: "#3DAF58",
    },
  },

  typography: {
    fontFamily: "var(--font-clash), sans-serif",

    h1: {
      fontSize: "2.988rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    h2: {
      fontSize: "2.488rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    h3: {
      fontSize: "2.075rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    h4: {
      fontSize: "1.725rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    h5: {
      fontSize: "1.438rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    h6: {
      fontSize: "1.2rem",
      fontWeight: 400,
      lineHeight: 1,
    },

    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },

    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },

  components: {
    MuiCircularProgress: {
      defaultProps: {
        color: "primary",
        size: 100,
        thickness: 8,
      },
      styleOverrides: {
        root: {},
        circle: {
          strokeLinecap: "round",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          boxShadow: "none",
          fontAlign: "left",
          fontFamily: "var(--font-clash), sans-serif",
          fontSize: "16px",
          fontWeight: 400,
          height: "64px",
          textTransform: "none",
          "&:hover": {
            boxShadow: "none",
          },

          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 999,
          display: "flex",
          justifyContent: "space-between",
          minHeight: 46,
          padding: 4,
        }),

        indicator: {
          display: "none",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          color: theme.palette.primary.contrastText,
          fontSize: "16px",
          minHeight: 40,
          minWidth: "25%",
          textTransform: "none",
          transition: "all 0.2s ease",

          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },

          "&:hover": {
            backgroundColor: theme.palette.primary.main,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          fontFamily: "var(--font-clash), sans-serif",
        },

        h1: {
          margin: 0,
        },

        h2: {
          margin: 0,
        },

        h3: {
          margin: 0,
        },

        h4: {
          margin: 0,
        },

        h5: {
          margin: 0,
        },

        h6: {
          margin: 0,
        },

        p: {
          margin: 0,
        },
        ".swiper-button-next, .swiper-button-prev": {
          color: `${theme.palette.primary.contrastText} !important`,
        },

        ".swiper-pagination-bullet": {
          backgroundColor: theme.palette.text.secondary,
          opacity: 1,
        },

        ".swiper-pagination-bullet-active": {
          backgroundColor: theme.palette.text.primary,
        },
      }),
    },
  },
});

export default theme;
