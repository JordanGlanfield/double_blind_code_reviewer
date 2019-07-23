import React, {useState} from 'react'
import {AppBar, IconButton, Toolbar, Typography, useScrollTrigger} from '@material-ui/core/index'
import MenuIcon from '@material-ui/icons/Menu'
import useStyles from "./style"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import useUserDisplayName from './userDisplayNameHook'

function ElevationScroll({children, window}) {
    return React.cloneElement(children, {
        elevation: useScrollTrigger({disableHysteresis: true, threshold: 0}) ? 4 : 0
    })
}

export default props => {
    const { appHistory, onLogoutAction, toggleSidebar } = props
    const classes = useStyles()
    const [anchorElem, setAnchorElem] = useState(null)
    const [userDisplayName, _] = useUserDisplayName(appHistory)

    const openMenu = (event) => setAnchorElem(event.currentTarget)
    const closeMenu = () => setAnchorElem(null)

    return (
        <ElevationScroll {...props}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="Menu"
                        onClick={toggleSidebar}
                        className={classes.drawerButton}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.lastItemLeft}>Photos</Typography>
                    <Button aria-controls="User menu" aria-haspopup="true" color="inherit" onClick={openMenu}>
                        {userDisplayName}
                    </Button>
                    <Menu
                        keepMounted
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
                        open={Boolean(anchorElem)}
                        onClose={closeMenu}>
                        <MenuItem onClick={onLogoutAction}>Log out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    )
}
