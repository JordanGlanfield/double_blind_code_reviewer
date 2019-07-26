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
} from '@material-ui/core/index'
import {
    Assignment as AssignmentIcon,
    BugReport as BugReportIcon,
    Code as CodeIcon,
    School as SchoolIcon
} from '@material-ui/icons/index'
import useStyles from "./style";


const linksToIcons = [
    ['GitLab', 'https://gitlab.doc.ic.ac.uk', <CodeIcon/>],
    ['LabTS', 'https://teaching.doc.ic.ac.uk/labts', <AssignmentIcon/>],
    ['CATE', 'https://cate.doc.ic.ac.uk', <SchoolIcon/>]
]

const issuesLink = "https://gitlab.doc.ic.ac.uk/edtech/tapp/issues"

export default (props) => {
    const {isOpenOnMobile, toggleSidebar} = props.useResponsiveSidebar
    const classes = useStyles()


    const drawer = (
        <div className={classes.sidebar}>
            <div className={classes.drawerSideBlock}>
                <Typography variant="h6" color="textSecondary">Menu</Typography>
            </div>
            <Divider/>
            <List>{linksToIcons.map(([text, link, icon]) => (
                    <ListItem button key={text} component="a" href={link} target="_blank">
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
            ))}</List>
            <Divider/>
            <div className={classes.drawerCenteredBlock}>
                <Button variant="contained" color="secondary" href={issuesLink}>
                    Found a bug? <BugReportIcon className={classes.rightIcon}/>
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
                    ModalProps={{ keepMounted: true }}
                    classes={{ paper: classes.drawerPaper}}>
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    classes={{ paper: classes.drawerPaper }}
                    variant="permanent"
                    open>
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}
