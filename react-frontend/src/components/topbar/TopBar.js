import React from 'react'
import {AppBar, IconButton, Toolbar, Typography, useScrollTrigger} from '@material-ui/core/index'
import MenuIcon from '@material-ui/icons/Menu'
import useStyles from "./style";

function ElevationScroll({ children, window }) {
  return React.cloneElement(children, {
    elevation: useScrollTrigger({ disableHysteresis: true, threshold: 0 }) ? 4 : 0
  })
}

export default props => { 
  const classes = useStyles()

  return (
    <ElevationScroll {...props}>
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="Menu"
          onClick={props.toggleSidebar}
          className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          Photos
        </Typography>
      </Toolbar>
    </AppBar>
  </ElevationScroll>
  )
}
