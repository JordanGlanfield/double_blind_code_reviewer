import {makeStyles} from "@material-ui/core";
import drawerWidth from "../layoutConstants";

const useStyles = makeStyles(theme => ({
    toolbar: {
    },
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
    menu: {
        border: '1px solid #d3d4d5'
    }
}))

export default useStyles

