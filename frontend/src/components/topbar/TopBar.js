import React, {useState} from 'react'
import {AppBar, IconButton, Toolbar, Typography, useScrollTrigger} from '@material-ui/core/index'
import {ExitToApp as ExitIcon, Menu as MenuIcon} from '@material-ui/icons'
import {StyledMenu, StyledMenuItem, useStyles} from "./style"
import Button from "@material-ui/core/Button"
import useUserDisplayName from './userDisplayNameHook'
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

function ElevationScroll({children, window}) {
    return React.cloneElement(children, {
        elevation: useScrollTrigger({disableHysteresis: true, threshold: 0}) ? 4 : 0
    })
}

export default props => {
    const {appHistory, onLogoutAction, toggleSidebar} = props
    const classes = useStyles()
    const [anchorElem, setAnchorElem] = useState(null)
    const [userDisplayName] = useUserDisplayName(appHistory)

    const openMenu = (event) => setAnchorElem(event.currentTarget)
    const closeMenu = () => setAnchorElem(null)

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
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.lastItemLeft}>{props.pageTitle}</Typography>
                    <Button aria-controls="User menu" aria-haspopup="true" color="inherit" onClick={openMenu}>
                        {userDisplayName}
                    </Button>
                    <StyledMenu
                        keepMounted
                        anchorEl={anchorElem}
                        open={Boolean(anchorElem)}
                        onClose={closeMenu}>
                        <StyledMenuItem onClick={onLogoutAction}>
                            <ListItemIcon>
                                <ExitIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Log Out"/>
                        </StyledMenuItem>
                    </StyledMenu>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    )
}
