import {makeStyles} from "@material-ui/core";
import drawerWidth from "../layoutConstants";

const useStyles = makeStyles(theme => ({
    toolbar: {
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    appBar: {
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
}))

export default useStyles

