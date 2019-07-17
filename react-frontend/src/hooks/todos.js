import { useState, useEffect } from 'react'

export default (initialValue = []) => {
  const [todos, setTodos] = useState(initialValue)


  useEffect(() => {
    fetch('/todos').then(response => 
      response.json().then(data => 
        setTodos(data)))
  }, [])

  return {
    todos,
    addTodo: async title => {
      const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(title)
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('addTodo: error.')
    },
    checkTodo: async id => {
      const response = await fetch(`/check/${id}`, {
        method: 'POST'
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('checkTodo: error.')
    }, 
    removeTodo: async id => {
      const response = await fetch(`/remove/${id}`, {
        method: 'POST'
      })
      response.ok 
      ? response.json().then(data => setTodos(data))
      : console.log('removeTodo: error.')
    }
  }
}

