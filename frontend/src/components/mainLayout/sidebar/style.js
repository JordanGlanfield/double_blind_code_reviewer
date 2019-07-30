import { makeStyles } from "@material-ui/core/index"
import drawerWidth from "../../../constants/layout"

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0
    },
    display: "flex"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerSideBlock: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    ...theme.mixins.toolbar
  },
  drawerCenteredBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    ...theme.mixins.toolbar
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}))

export default useStyles
