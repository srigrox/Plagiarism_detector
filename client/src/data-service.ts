
import { TodoItem } from './todo.interface';
import axios from 'axios';

export class DataService {

  public static getTodos(): Promise<Array<TodoItem>> {
    return axios.get<Array<TodoItem>>('http://localhost:3001/todo')
      .catch((error: Error): any  => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static addTodo(todo: TodoItem) {
    const body: any = { todo: todo };
    return axios.post<Array<TodoItem>>('http://localhost:3001/todo', body)
      .catch((error: Error): any  => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static removeTodo(todo: TodoItem) {
    return axios.delete<Array<TodoItem>>('http://localhost:3001/todo?todo=' + todo.title)
      .catch((error: Error): any  => {
        console.error('Something went wrong: ', error.message);
        return {data: [] };
      });
  }



}
