import {makeStyles} from "@material-ui/core"
import drawerWidth from "../constants/layout"

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
}))

export default useStyles