import axios from 'axios'
import { HttpClient } from './HttpClient'

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    return (await axios.get(url)).data
  }

  async post(url: string, data: any): Promise<any> {
    return (await axios.post(url, data)).data
  }
}
