import React, {useState} from 'react'
import Header from '../topbar/TopBar.js'
import Sidebar from '../sidebar/Sidebar.js'
import useResponsiveSidebar from '../sidebar/responsiveSidebarHook.js'
import {CssBaseline} from '@material-ui/core/index'
import authenticationService from "../../utils/authenticationService";
import routes from '../../constants/routes'
import {BrowserRouter, Route} from "react-router-dom";
import Home from "../home/Home";

const AppLayout = props => {
    const sidebarHandle = useResponsiveSidebar()
    const [pageTitle, setPageTitle] = useState('')

    const logout = (event) => {
        event.preventDefault()
        authenticationService.logout()
        props.history.push(routes.LOGIN)
    }

    return (
        <BrowserRouter>
            <div>
                <CssBaseline/>
                <Header pageTitle={pageTitle}
                        appHistory={props.history}
                        onLogoutAction={logout}
                        toggleSidebar={sidebarHandle.toggleSidebar}/>
                <Sidebar useResponsiveSidebar={sidebarHandle}/>
                <Route exact path={routes.HOME} render={(routeProps) => (
                    <Home {...routeProps} setPageTitle={setPageTitle}/>
                )}/>
            </div>
        </BrowserRouter>
    )
}
export default AppLayout