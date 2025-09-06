import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import passport from "./config/passport";

import authRouter from "./modules/auth/auth.route";

import AppError from "./utils/appError";
import globalErrorHandler from "./middlewares/globalError.middleware";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(morgan("dev"));
app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// swagger

// test route
app.get("/", (req: Request, res: Response) => {
  res.json("Welcome to auth system");
});

app.get("/oauthloginPage", (req, res) => {
  res.send(`<a href="/auth/google">Login with Google</a> <a href="/auth/github">Login with GitHub</a>`);
});


// routes
app.use("/auth", authRouter);

// not found
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handler
app.use(globalErrorHandler);

export default app;
