import React from "react"
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger
} from "@material-ui/core/index"
import { ExitToApp as ExitIcon, Menu as MenuIcon } from "@material-ui/icons"
import { useStyles } from "./style"

function ElevationScroll({ children, window }) {
  return React.cloneElement(children, {
    elevation: useScrollTrigger({ disableHysteresis: true, threshold: 0 })
      ? 4
      : 0
  })
}

export default props => {
  const { onLogoutAction, toggleSidebar } = props
  const classes = useStyles()

  return (
    <ElevationScroll {...props}>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Side Menu Toggle"
            onClick={toggleSidebar}
            className={classes.drawerButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.lastItemLeft}>
            The Template App
          </Typography>
          <IconButton
            edge="end"
            aria-label="Log out"
            color="inherit"
            onClick={onLogoutAction}>
            <ExitIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  )
}
