import React from 'react'
import {
    Button,
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import drawerWidth from './layoutConstants.js'
import {
    Assignment as AssignmentIcon,
    BugReport as BugReportIcon,
    Code as CodeIcon,
    School as SchoolIcon
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
        display: "flex"
    },
    sidebar: {
        top: 54
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerSideBlock: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(2),
        ...theme.mixins.toolbar,
    },
    drawerCenteredBlock: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        ...theme.mixins.toolbar,
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
}));

export default (props) => {
    const {isOpenOnMobile, toggleSidebar} = props.useResponsiveSidebar
    const classes = useStyles()


    const drawer = (
        <div className={classes.sidebar}>
            <div className={classes.drawerSideBlock}>
                <Typography variant="h6" color="textSecondary">My App</Typography>
            </div>
            <Divider/>
            <List>
                {[
                    ['GitLab', 'https://gitlab.doc.ic.ac.uk', <CodeIcon/>],
                    ['LabTS', 'https://teaching.doc.ic.ac.uk/labts', <AssignmentIcon/>],
                    ['CATE', 'https://cate.doc.ic.ac.uk', <SchoolIcon/>]].map(([text, link, icon], index) => (
                    <ListItem button key={text} component="a" href={link} target="_blank">
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <div className={classes.drawerCenteredBlock}>
                <Button variant="contained" color="primary" href="https://cate.doc.ic.ac.uk">
                    Found a bug?
                    <BugReportIcon className={classes.rightIcon}/>
                </Button>
            </div>
        </div>
    )

    return (
        <nav className={classes.drawer}>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    open={isOpenOnMobile}
                    onClose={toggleSidebar}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    classes={{
                        paper: classes.drawerPaper
                    }}>
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    variant="permanent"
                    open>
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}
