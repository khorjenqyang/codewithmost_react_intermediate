import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import {Todo} from '../hooks/useTodos';
import axios from 'axios';

interface AddTodoContext {
  previousTodos:Todo[]
}

const TodoForm = () => {

  //use main query client because we want to access the cache
  const queryClient = useQueryClient()

  const addTodo = useMutation<Todo,Error,Todo,AddTodoContext>({

      mutationFn:(todo:Todo)=>
        axios
          .post<Todo>("https://jsonplaceholder.typicode.com/todozs",todo)
          .then(res=>res.data),

      onMutate:(newTodo:Todo)=>{

        const previousTodos = queryClient.getQueryData<Todo[]>(['todos']) || [];

        // Updating the data in the cache
        queryClient.setQueryData<Todo[]>(['todos'],todos =>[newTodo,...(todos||[]),])
        
        if (ref.current) ref.current.value = ""

        return {previousTodos}
      },

      // first arg is response from client, second arg is body send to client
      onSuccess: (savedTodo,newTodo)=>{
        queryClient.setQueryData<Todo[]>(['todos'],todos=>todos?.map(todo=> todo === newTodo?savedTodo:todo))
      },

      onError:(error,newTodo,context)=>{
        if (!context) return

        queryClient.setQueryData<Todo[]>(['todos'],context.previousTodos)
      }
  })

  const ref = useRef<HTMLInputElement>(null);

  return (
    <>

      {addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}

      <form className="row mb-3" onSubmit={event=>{

        event.preventDefault();

        if (ref.current && ref.current.value)
          addTodo.mutate({
            id:0,
            title: ref.current?.value,
            completed:false,
            userId:1
        })
        
      }}>

        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>

        <div className="col">
          <button className="btn btn-primary"
            disabled={addTodo.isLoading}
          >
            {addTodo.isLoading?"Adding...":"Add"}
          </button>
        </div>

      </form>
    </>
  );
};

export default TodoForm;
