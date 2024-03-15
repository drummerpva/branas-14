import fetch from 'node-fetch'
import { HttpClient } from './HttpClient'

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url)

    try {
      return await response.json()
    } catch (error) {
      return null
    }
  }

  async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })

    return response.json()
  }
}
