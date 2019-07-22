import { useState, useEffect } from 'react'

export default (initialValue = []) => {
  const [todos, setTodos] = useState(initialValue)


  useEffect( () => {
    async function fetchTodos() {
      const response = await fetch('/api/todos', {
        headers: {'Authorization': `Bearer ${sessionStorage.getItem('currentUser')}`}
      })
      const data = await response.json()
      if (response.ok) {
        setTodos(data)
      } else {
        console.log(data)
      }
    }
    fetchTodos()
  }, [])

  return {
    todos,
    addTodo: async title => {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(title)
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('addTodo: error.')
    },
    checkTodo: async id => {
      const response = await fetch(`/api/check/${id}`, {
        method: 'POST'
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('checkTodo: error.')
    }, 
    removeTodo: async id => {
      const response = await fetch(`/api/remove/${id}`, {
        method: 'POST'
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('removeTodo: error.')
    }
  }
}

