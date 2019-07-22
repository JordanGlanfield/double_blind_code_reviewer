import React from 'react'
import Header from '../topbar/TopBar.js'
import TodoApp from '../TodoApp.js'
import Sidebar from '../Sidebar.js'
import useResponsiveSidebar from '../../hooks/sidebar.js'
import {CssBaseline} from '@material-ui/core/index'
import authenticationService from "../authenticationService";

const Layout = props => {
    const sidebarHandle = useResponsiveSidebar()

    const logout = (event) => {
        event.preventDefault()
        authenticationService.logout()
        console.log('good here')
        props.history.push('/login')
    }

    return (
        <div>
            <CssBaseline/>
            <Header onLogoutAction={logout} toggleSidebar={sidebarHandle.toggleSidebar}/>
            <Sidebar useResponsiveSidebar={sidebarHandle}/>
            <TodoApp/>
        </div>
    )
}
export default Layout
