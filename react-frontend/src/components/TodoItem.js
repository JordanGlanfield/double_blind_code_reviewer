import React from 'react'
import {
  ListItem, 
  ListItemSecondaryAction, 
  IconButton,
  ListItemText,
  Checkbox
} from '@material-ui/core'
import { 
  Delete,
  CheckCircleOutline as Checked,
  RadioButtonUnchecked as Unchecked
} from '@material-ui/icons'

const TodoItem = props => {
  const item = props.item
  return (
    <ListItem divider={props.divider}>
      <Checkbox 
        icon={<Unchecked/>} 
        checkedIcon={<Checked />} 
        checked={item.done}
        onChange={() => props.onCheckboxChange(item.id)}
        color='primary' />
      <ListItemText primary={item.title} 
        style={{ textDecoration: item.done ? 'line-through' : '' }} />  
      <ListItemSecondaryAction> 
        <IconButton color='primary' onClick={() => props.handleDelete(item.id)}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
)
}

export default TodoItem
