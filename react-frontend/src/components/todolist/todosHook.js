import {useState, useEffect} from 'react'
import routes from "../../constants/routes";
import performOrRedirect from "../utils/redirection";
import authConstants from "../../constants/auth";

export default (history, initialValue = []) => {
    const [todos, setTodos] = useState(initialValue)


    useEffect(() => {
        const fetchTodos = async () => {
            return fetch('/api/todos', {
                headers: {'Authorization': authConstants.ACCESS_TOKEN_HEADER()}
            })
        }
        fetchTodos().then(response =>
            performOrRedirect(response, setTodos, () => history.push(routes.LOGIN))
        )
    }, [])


    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authConstants.ACCESS_TOKEN_HEADER()
        },
    }

    return {
        todos,
        addTodo: async title => {
            requestOptions.body = JSON.stringify(title)
            const response = await fetch('/api/add', requestOptions)
            performOrRedirect(response, setTodos, () => history.push(routes.LOGIN))
        },
        checkTodo: async id => {
            const response = await fetch(`/api/check/${id}`, requestOptions)
            performOrRedirect(response, setTodos, () => history.push(routes.LOGIN))
        },
        removeTodo: async id => {
            const response = await fetch(`/api/remove/${id}`, requestOptions)
            performOrRedirect(response, setTodos, () => history.push(routes.LOGIN))
        }
    }
}

