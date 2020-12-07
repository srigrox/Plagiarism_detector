import axios from 'axios';
import { URLSearchParams } from 'url';

export class DataService {

  // Get list of files uploaded
  public static getListFiles(): Promise<Array<string>> {
    return axios.get<Array<any>>('http://localhost:3001/file')
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  // Get comparison 
  public static getComparisons(): Promise<any> {
    return axios.get('http://localhost:3001/comparison')
    .catch((error: Error): any => {
      console.error('Something went wrong: ', error.message);
      return { data: [] };
    });
  }

  // Post the two files selected by user
  public static postComparison(file1: string, file2: string) {
    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);
    console.log(file1, file2);
    return axios.post('http://localhost:3001/comparison', formData)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  // Delete files from the list of files
  public static removeFile(fileName: string) {
    return axios.delete('http://localhost:3001/file?file=' + fileName)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  // remove history from list of history
  public static removeHistory(id: string) {
    return axios.delete('http://localhost:3001/history?file=' + id)
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }

  // get list of summary of past comparisons
  public static getHistory(): Promise<Array<any>> {
    return axios.get<Array<any>>('http://localhost:3001/history')
      .catch((error: Error): any => {
        console.error('Something went wrong: ', error.message);
        return { data: [] };
      });
  }
}
