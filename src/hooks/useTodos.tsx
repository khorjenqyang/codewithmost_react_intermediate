import { useQuery } from "@tanstack/react-query"
import axios from 'axios';

export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
  }
  
export const useTodos = () => {

    return useQuery<Todo[],Error>({ 
        queryKey: ['todos'],
        queryFn: ()=> axios
          .get('https://jsonplaceholder.typicode.com/todos')
          .then(res=>res.data)
      })
    
}