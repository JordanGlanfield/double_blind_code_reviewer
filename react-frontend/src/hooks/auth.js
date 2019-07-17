import {useState} from 'react'

export default () => {
    const [username, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const clearInput = () => {
        setUser('')
        setPassword('')
    }

    const authenticated = async () => {
        const response = await fetch('/authstatus')
        const data = await response.json()
        return data.authenticated
    }

    return {
        isAuthenticated: authenticated,
        error: error,
        authenticate: async (event, username, password) => {
            event.preventDefault()
            const response = await fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: username, password: password})
            })
            clearInput()

            if (response.ok) {
                setError(false)
                setRedirect(true)
            } else {
                setError(true)
                setRedirect(false)
            }
        },
        redirect: redirect,
    }
}