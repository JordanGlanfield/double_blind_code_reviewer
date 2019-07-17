import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar/index'
import Button from '@material-ui/core/Button/index'
import CssBaseline from '@material-ui/core/CssBaseline/index'
import TextField from '@material-ui/core/TextField/index'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography/index'
import Container from '@material-ui/core/Container/index'
import useStyles from './style'
import useAuthentication from './useAutentication'

export default function SignIn(props) {
    const classes = useStyles()
    const destination = '/'
    const [username, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [authenticate, error, allowRedirection] = useAuthentication()

    const authenticateAndResetTextFields = (event) => {
        authenticate(event, username, password)
        setUser('')
        setPassword('')
    }

    if (allowRedirection) return <Redirect to={destination} />
    return (
        //
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <form className={classes.form} onSubmit={authenticateAndResetTextFields}>
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
                        onChange={(event) => setUser(event.target.value)}
                        autoFocus />
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
                        onChange={(event) => setPassword(event.target.value)} />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Log In
                    </Button>
                </form>
            </div>
            <Container hidden={!error}>
                <Typography variant="body2" align="center" color="error">
                    Invalid Credentials. Try again.
                </Typography>
            </Container>
        </Container>
    )
}