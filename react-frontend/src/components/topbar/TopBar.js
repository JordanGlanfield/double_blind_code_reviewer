import React, {useState} from 'react'
import {AppBar, IconButton, Toolbar, Typography, useScrollTrigger} from '@material-ui/core/index'
import MenuIcon from '@material-ui/icons/Menu'
import useStyles from "./style";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import authenticationService from "../authenticationService";
import Button from "@material-ui/core/Button";

function ElevationScroll({ children, window }) {
  return React.cloneElement(children, {
    elevation: useScrollTrigger({ disableHysteresis: true, threshold: 0 }) ? 4 : 0
  })
}

export default props => { 
  const classes = useStyles()
  const [anchorElem, setAnchorElem] = useState(null);

  function openMenu(event) {
    setAnchorElem(event.currentTarget);
  }

  function closeMenu() {
    setAnchorElem(null);
  }

  return (
    <ElevationScroll {...props}>
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton 
          edge="start" 
          color="inherit" 
          aria-label="Menu"
          onClick={props.toggleSidebar}
          className={classes.drawerButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          Photos
        </Typography>
        <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={openMenu}>
          User
        </Button>
        <Menu
            className={classes.menu}
            elevation={0}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorElem}
            keepMounted
            open={Boolean(anchorElem)}
            onClose={closeMenu}>
          <MenuItem onClick={props.onLogoutAction}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  </ElevationScroll>
  )
}
