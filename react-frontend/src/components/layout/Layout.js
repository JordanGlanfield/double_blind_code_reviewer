import React from 'react'
import Header from '../topbar/TopBar.js'
import Sidebar from '../../sidebar/Sidebar.js'
import useResponsiveSidebar from '../../hooks/sidebar.js'
import {CssBaseline} from '@material-ui/core/index'
import authenticationService from "../authenticationService";
import routes from '../../constants/routes'
import TodoApp from "../todolist/TodoApp";
import {BrowserRouter, Route} from "react-router-dom";
import Landing from "../home/Landing";

const Layout = props => {
    const sidebarHandle = useResponsiveSidebar()

    const logout = (event) => {
        event.preventDefault()
        authenticationService.logout()
        props.history.push(routes.LOGIN)
    }

    return (
        <BrowserRouter>
            <div>
                <CssBaseline/>
                <Header appHistory={props.history}
                        onLogoutAction={logout}
                        toggleSidebar={sidebarHandle.toggleSidebar} />
                <Sidebar useResponsiveSidebar={sidebarHandle}/>
                <Route exact path={routes.TODOS} render={(routeProps) => (
                    <TodoApp {...props} appHistory={props.history} />
                )} />
                <Route exact path={routes.HOME} component={Landing} />
            </div>
        </BrowserRouter>
    )
}
export default Layout