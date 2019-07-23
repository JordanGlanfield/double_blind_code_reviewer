import React from 'react'
import { 
  Grid,
  TextField, 
  Button,
  Box
} from '@material-ui/core/index'

export default props => {
  return( 
      <Box style={{ padding: 32 }}>
        <Grid container spacing={1} alignItems='center'>
          <Grid item xs={12} sm={10}>
            <TextField fullWidth label='Task name' value={props.todoInputHook} onChange={props.onInputChange} />

          </Grid> 
          <Grid item xs={12} sm={2}>
            <Button fullWidth 
              type='submit' 
              color='primary' 
              variant='contained' 
              disabled={!props.todoInputHook}
              onClick={props.onAdd}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
  )
}
