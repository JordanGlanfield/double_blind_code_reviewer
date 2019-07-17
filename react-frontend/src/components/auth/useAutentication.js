import {useState} from 'react'

export default () => {
    const [error, setError] = useState(false)
    const [allowRedirection, setAllowRedirection] = useState(false)

    const authenticate = async (event, username, password) => {
        event.preventDefault()
        const response = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password})
        })
        if (response.ok) {
            setError(false)
            setAllowRedirection(true)
        } else {
            setError(true)
            setAllowRedirection(false)
        }
    }

    return [authenticate, error, allowRedirection]
}