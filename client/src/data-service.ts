
import { TodoItem } from './todo.interface';
import axios from 'axios';
import { URLSearchParams } from 'url';

export class DataService {

  public static getTodos(): Promise<Array<TodoItem>> {
    return axios.get<Array<TodoItem>>('http://localhost:3001/todo')
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static getHistory(): Promise<Array<Array<string>>> {
    return axios.get<Array<Array<string>>>('http://localhost:3001/history')
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }



  public static getListFiles(): Promise<Array<string>> {
    return axios.get<Array<string>>('http://localhost:3001/file')
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static postFileSelection(file1: string, file2: string) {
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    return axios.post('http://localhost:3001/fileselection', formData)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static addTodo(todo: TodoItem) {
    const body: any = { todo: todo };
    return axios.post<Array<TodoItem>>('http://localhost:3001/todo', body)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static removeTodo(todo: TodoItem) {
    return axios.delete<Array<TodoItem>>('http://localhost:3001/todo?todo=' + todo.title)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static removeFile(fileName: string) {
    return axios.delete('http://localhost:3001/file?file=' + fileName)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  public static removeHistory(file1: string, file2: string) {
    return axios.delete('http://localhost:3001/history', {data: {file1: file1, file2: file2}})
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }



}
