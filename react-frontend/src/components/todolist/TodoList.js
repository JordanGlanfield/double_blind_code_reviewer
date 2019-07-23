import React from 'react'
import TodoItem from './TodoItem.js'
import List from '@material-ui/core/List/index'

export default props => {
  return (
    <List>{ 
      props.items.map((item, index) => {
        return <TodoItem key={item.id} 
                         divider={index !== props.items.length - 1}
                         item={item} 
                         onCheckboxChange={props.onCheckboxChange}
                         handleDelete={props.removeTodo}/>
      }) 
    }</List>
  )
}
