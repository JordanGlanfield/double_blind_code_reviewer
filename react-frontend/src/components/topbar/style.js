import {makeStyles} from "@material-ui/core";
import drawerWidth from "../../constants/layout";

const useStyles = makeStyles(theme => ({
    drawerButton: {
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
    lastItemLeft: {
        flexGrow: 1
    },
    menu: {
        border: '1px solid #d3d4d5',
    }
}))

export default useStyles

