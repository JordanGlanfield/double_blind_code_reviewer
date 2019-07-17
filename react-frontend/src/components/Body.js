import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { 
  TextField, 
  Typography, 
  Button,
} from '@material-ui/core'
import TodoList from './TodoList'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    justify: 'center',
    padding: 20
  }
}))

export default props => { 
  const classes = useStyles()
  return (
    <>
    <form className={classes.form}>
      <TextField label='Task name' value={newTask} onChange={this.onInputChange} />
      <Button type='submit' 
        color='primary' 
        variant='contained' 
        disabled={!newTask}
        onClick={this.onFormSubmit}>
        Add
      </Button>
    </form>
    <TodoList items={this.state.items} handleDelete={this.handleDelete} />
    </>
  )
}
