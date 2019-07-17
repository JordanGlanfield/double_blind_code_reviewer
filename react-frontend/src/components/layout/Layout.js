import React from 'react'
import Header from '../topbar/TopBar.js'
import TodoApp from '../TodoApp.js'
import Sidebar from '../Sidebar.js'
import useResponsiveSidebar from '../../hooks/sidebar.js'
import {
  CssBaseline,
} from '@material-ui/core/index'

const Layout = props => {
  const sidebarHandle = useResponsiveSidebar()

  return (
    <div>
      <CssBaseline />
      <Header
        toggleSidebar={sidebarHandle.toggleSidebar} />
      <Sidebar useResponsiveSidebar={sidebarHandle} />
      <TodoApp />
    </div>
  )
}
export default Layout
