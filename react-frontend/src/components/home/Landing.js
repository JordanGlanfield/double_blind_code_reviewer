import {Container} from "@material-ui/core";
import React from "react";
import useStyles from "./style";
import coding from '../../static/coding.gif'

const Home = props => {
    const classes = useStyles()

    return (
        <div className={classes.main}>
            <Container className={classes.container}>
                    <img src={coding}/>

            </Container>
        </div>
    )
}

export default Home