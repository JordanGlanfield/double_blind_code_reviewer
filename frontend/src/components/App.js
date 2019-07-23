import React from 'react'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import AppLayout from "./appLayout/AppLayout";
import Login from "./login/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import routes from "../constants/routes";

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={routes.LOGIN} component={Login}/>
                <ProtectedRoute path='/' component={AppLayout}/>
            </Switch>
        </BrowserRouter>
    )
}
