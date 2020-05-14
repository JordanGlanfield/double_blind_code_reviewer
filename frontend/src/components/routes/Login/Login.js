import React, { useState } from "react"
import { Link, Redirect } from "react-router-dom"
import { Button, Container, CssBaseline, TextField, Typography } from "@material-ui/core/index"
import useStyles from "./style"
import { checkIsAuthenticated, getUsername, login, setUsername } from "../../../utils/authenticationService"
import routes from "../../../constants/routes"
import { useDataSource } from "../../../utils/hooks";

export default props => {
  const classes = useStyles()
  const [username, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  let { from } = props.location.state || { from: { pathname: routes.getHome(username) } }

  if (props.isLoggedIn) {
    return <Redirect to={{pathname: routes.getHome(getUsername())}} />
  }

  const loginPressed = async event => {
    event.preventDefault()
    const success = await login(username, password)
    if (success) {
      setUsername().then(() => {
        props.loggedIn();
      });
    }
    else {
      setUser("")
      setPassword("")
      setError(!success)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h3" color="primary">
          DBCR
        </Typography>
        <Typography component="h1" variant="h6" color="textSecondary">
          A tool for double blind code review
        </Typography>
        <form className={classes.form} onSubmit={loginPressed}>
          <TextField
            error={error}
            variant="outlined"
            margin="normal"
            value={username}
            required
            fullWidth
            id="email"
            label="Username"
            name="email"
            onChange={event => setUser(event.target.value)}
            autoFocus
          />
          <TextField
            error={error}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            name="password"
            label="Password"
            type="password"
            onChange={event => setPassword(event.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Log In
          </Button>
        </form>
        <Link to={routes.SIGNUP}>Not a user? Create an account!</Link>
      </div>
      <Container hidden={!error}>
        <Typography variant="body2" align="center" color="error">
          Invalid Credentials. Try again.
        </Typography>
      </Container>
    </Container>
  )
}
