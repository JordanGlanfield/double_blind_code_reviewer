import { makeStyles } from "@material-ui/core"
import drawerWidth from "../../constants/layout"

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    height: "100vh",
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth
    }
  },
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4)
  },
  gridContainer: {
    padding: theme.spacing(2)
  }
}))

export default useStyles
