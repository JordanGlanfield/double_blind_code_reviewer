import React from 'react'
import { Redirect } from 'react-router-dom'
import routes from '../../constants/routes'

export default function ProtectedArea({isAuthenticatedSource, children}) {
  console.log(children)
  return <>
    {(!isAuthenticatedSource.isFetching && !isAuthenticatedSource.data)
      && <Redirect to={{pathname: routes.LOGIN}}/>}
    {children}
  </>
}