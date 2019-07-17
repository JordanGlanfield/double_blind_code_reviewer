import { useState } from 'react'

export default (initialValue = '') => {
  const [input, setTextInput] = useState(initialValue)

  return {
    input,
    setInput: (event) => setTextInput(event.target.value),
    clearInput: () => setTextInput('')
  }
}
