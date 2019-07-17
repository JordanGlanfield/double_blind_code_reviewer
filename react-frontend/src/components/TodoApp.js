import React from 'react'
import TodoList from './TodoList.js'
import TodoTaskInput from './TodoTaskInput.js'
import { 
  Grid,
  Box,
  Container
} from '@material-ui/core'
import useInput from '../hooks/input.js'
import useTodos from '../hooks/todos.js'
import { makeStyles } from '@material-ui/core/styles'
import drawerWidth from './layoutConstants.js'

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    },
  },
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
  },
  body: theme.mixins.toolbar
}))

const TodoApp = props => {
  const { input, setInput, clearInput } = useInput()
  const { todos, addTodo, checkTodo, removeTodo } = useTodos()
  const classes = useStyles()

  const addNewTodoAndClearInput = _ => {
    clearInput()
    addTodo(input)
  }

  return (
    <main className={classes.main}>
    <div className={classes.body}>
      <Container className={classes.container}>
      <TodoTaskInput input={input} onInputChange={setInput} onAdd={addNewTodoAndClearInput} />  
      <Grid container direction='column'>
        <Grid item>
          <Box style={{ margin: 16, padding: 16 }}>
            <TodoList 
              items={todos} 
              onCheckboxChange={checkTodo}
              removeTodo={removeTodo} />
          </Box>
        </Grid>
      </Grid>
    </Container>
    </div>
  </main>
  )
}

export default TodoApp
