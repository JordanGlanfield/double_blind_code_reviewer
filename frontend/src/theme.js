import { createMuiTheme } from "@material-ui/core/styles"

/* The theme is based on the official Imperial Brand colours.
   More specifically, primary is Imperial Blue, secondary is Imperial Teal */
export default createMuiTheme({
  palette: {
    primary: {
      light: "#4267a1",
      dark: "#001846",
      main: "#003d72",
      contrastText: "#ffffff"
    },
    secondary: {
      light: "#53b2c1",
      dark: "#005563",
      main: "#0f8291",
      contrastText: "#ffffff"
    }
  }
})
