import { Request, Response, NextFunction } from "express-serve-static-core";
import express from "express";
import "express-async-errors";
import {json } from "body-parser"
import cookieSession from "cookie-session";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import csrf from "csurf";
import { currentUser, errorHandler, NotFoundError } from "@burger-world.com/common";
import { Container } from "inversify";
import UserRepository from "./repos/User.repo";
import UserService from "./services/user.service";
import { InversifyExpressServer } from "inversify-express-utils";
import UserController from "./controllers/user.controller";

const app = express();
app.set('trust proxy', 1);
app.use(json());
app.use(
    cookieSession({
      signed: false,
      secure: true,
    })
  );
  const corsOptions = {
    origin: 'https://burger-world.com',
    optionsSuccessStatus: 200
  };
  app.use(helmet());
  // app.use(csrf());
app.use(cors(corsOptions));
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later!",
})
app.use(rateLimiter);
app.use((req,res,next)=>{currentUser(req,res,next)});

const container = new Container();
container.bind(UserController).toSelf();
container.bind(UserRepository).toSelf();
container.bind(UserService).toSelf();

let server = new InversifyExpressServer(
    container,null,{
        rootPath: "/api"
    },
    app
);

let appConfigured = server.build();

appConfigured.all('*', async(req, res) => {
    throw new NotFoundError();
  });
  
  appConfigured.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
  errorHandler(err,req,res,next);
  });


export {app, appConfigured};