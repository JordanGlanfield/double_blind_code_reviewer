import {makeStyles} from "@material-ui/core";
import drawerWidth from "../../constants/layout";

const useStyles = makeStyles(theme => ({
    main: {
        flexGrow: 1,
        height: '100vh',
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth
        },
    },
    container: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(4),
    },
    body: theme.mixins.toolbar
}))

export default useStyles