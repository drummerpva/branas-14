import { HttpServer } from './HttpServer'
import express from 'express'
export class ExpressAdapter implements HttpServer {
  app: any
  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](
      url,
      async (req: express.Request, res: express.Response) => {
        try {
          const output = await callback(req.params, req.body, req.headers)
          res.json(output)
        } catch (error: any) {
          res.status(422).json({ message: error.message })
        }
      },
    )
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  }
}
