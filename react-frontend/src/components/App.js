import React from 'react'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import routes from "../constants/routes";

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={routes.LOGIN} component={Login}/>
                <ProtectedRoute path='/' component={Layout}/>
            </Switch>
        </BrowserRouter>

    )

}
