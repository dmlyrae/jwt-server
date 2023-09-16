import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { router } from "./router";
import { AppDataSource } from "./connect/connect"
import { errorMiddleware } from "./middlewares/error-middleware";

dotenv.config()

const PORT = parseInt(process.env.PORT ?? '5000')
const app: Express = express()


/* MIDDLEWARES */
/* *********** */

app.use(express.json()) // https://expressjs.com/en/4x/api.html#express.json
app.use(cookieParser()) // https://www.npmjs.com/package/cookie-parser
app.use(cors()) // https://expressjs.com/en/resources/middleware/cors.html
app.use(`/api`, router)
app.use(errorMiddleware)

const start = async () => {
    try {
        AppDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err)
            })
        app.listen(PORT, () => console.log(`Server started on ${PORT}.`))
    } catch (e:any) {
        console.log("error", e?.message)
    }
}

start()