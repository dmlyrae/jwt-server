import cors from "cors";
import cookieParser from "cookie-parser";
import * as connect from "./connect/connect"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { router } from "./router";
dotenv.config();

const PORT = parseInt(process.env.PORT ?? '5000');
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(`/api`, router);

const start = async () => {
    try {
        const client = await connect.getClient();
        app.listen(PORT, () => console.log(`Server started on ${PORT}.`))
    } catch (e:any) {
        console.log("error", e?.message)
    }
}

start();