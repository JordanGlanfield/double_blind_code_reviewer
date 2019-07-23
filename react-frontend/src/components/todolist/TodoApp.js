import React from 'react'
import TodoList from './TodoList.js'
import TodoTaskInput from './TodoTaskInput.js'
import {Box, Container, Grid} from '@material-ui/core/index'
import useTodoInput from './todoInputHook.js'
import useTodos from './todosHook.js'
import useStyles from "./style";


const TodoApp = props => {
    const {input, setInput, clearInput} = useTodoInput()
    const {todos, addTodo, checkTodo, removeTodo} = useTodos(props.appHistory)
    const classes = useStyles()

    const addNewTodoAndClearInput = _ => {
        clearInput()
        addTodo(input)
    }

    return (
        <main className={classes.main}>
            <div className={classes.body}>
                <Container className={classes.container}>
                    <TodoTaskInput input={input} onInputChange={setInput} onAdd={addNewTodoAndClearInput}/>
                    <Grid container direction='column'>
                        <Grid item>
                            <Box style={{margin: 16, padding: 16}}>
                                <TodoList
                                    items={todos}
                                    onCheckboxChange={checkTodo}
                                    removeTodo={removeTodo}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </main>
    )
}

export default TodoApp
