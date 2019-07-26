import { Container } from "@material-ui/core"
import React from "react"
import useStyles from "./style"
import coding from "../../assets/coding.gif"
import Grid from "@material-ui/core/Grid"

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.main}>
      <Container className={classes.container}>
        <Grid container justify="center" className={classes.gridContainer}>
          <Grid item xs={12}>
            <div style={{ textAlign: "center" }}>
              <img className={classes.image} src={coding} alt="ncvi" />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Home
