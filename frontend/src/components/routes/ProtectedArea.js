import React from 'react'
import { Redirect } from 'react-router-dom'
import routes from '../../constants/routes'

const ProtectedArea = ({isAuthenticatedSource, children}) => {
  return <>
    {(!isAuthenticatedSource.isFetching && !isAuthenticatedSource.data)
      && <Redirect to={{pathname: routes.LOGIN}}/>}
    {children}
  </>
};

export default ProtectedArea;