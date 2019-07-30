import React from "react"
import {
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core/index"
import {
  Assignment as AssignmentIcon,
  BugReport as BugReportIcon,
  Code as CodeIcon,
  School as SchoolIcon
} from "@material-ui/icons/index"
import useStyles from "./style"
import Avatar from "@material-ui/core/Avatar/index"
import Typography from "@material-ui/core/Typography/index"
import Container from "@material-ui/core/Container/index"

const linksToIcons = [
  ["Gitlab", "https://gitlab.doc.ic.ac.uk", <CodeIcon />],
  ["Labts", "https://teaching.doc.ic.ac.uk/labts", <AssignmentIcon />],
  ["Cate", "https://cate.doc.ic.ac.uk", <SchoolIcon />]
]

const issuesLink = "https://gitlab.doc.ic.ac.uk/edtech/tapp/issues"

export default props => {
  const { userFstName, userLastName } = props.userInfo
  const { isOpenOnMobile, toggleSidebar } = props.useResponsiveSidebar
  const classes = useStyles()

  const drawer = (
    <div>
      <div className={classes.drawerSideBlock}>
        <Container className={classes.container}>
          <Avatar className={classes.avatar}>{userFstName.charAt(0)}</Avatar>
          <Typography color="textSecondary">
            {userFstName} {userLastName}
          </Typography>
        </Container>
      </div>
      <Divider variant="middle" />
      <List>
        {linksToIcons.map(([text, link, icon]) => (
          <ListItem button key={text} component="a" href={link} target="_blank">
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider variant="middle" />
      <div className={classes.drawerCenteredBlock}>
        <Button variant="contained" color="secondary" href={issuesLink}>
          Found a bug? <BugReportIcon className={classes.rightIcon} />
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
          classes={{ paper: classes.drawerPaper }}>
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
