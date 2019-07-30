import React from "react"
import useStyles from "./style"
import coding from "../../../assets/coding.gif"
import Grid from "@material-ui/core/Grid/index"

const Home = () => {
  const classes = useStyles()

  return (
    <div>
      <Grid container justify="center" className={classes.gridContainer}>
        <Grid item xs={12}>
          <div style={{ textAlign: "center" }}>
            <img className={classes.image} src={coding} alt="ncvi" />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
