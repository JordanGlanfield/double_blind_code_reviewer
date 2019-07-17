import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

export default () =>
    <Router>
        <ProtectedRoute exact path="/" component={Layout} />
        <Route exact path="/login" component={Login} />
    </Router>
