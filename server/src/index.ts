import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import { mongoConnection } from "./config/mongo";
import passportConfig from "./config/passport";

import contestRouter from "./routers/contestRouter";
import authRouter from "./routers/authRouter";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Setup Passport.js
passportConfig();

// Setup Express server
const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

// Setup MongoDB
mongoConnection();

// Express session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "",
    }),
  })
);
app.use(cookieParser());

// Connect Passport.js to Express
app.use(passport.initialize());
app.use(passport.session());

// Setup basic GET request
app.get("/", (_req, res) => {
  res.send("Prediction Contest API");
});

// Setup API routes
app.use("/contest", contestRouter);
app.use("/auth", authRouter);

// Start Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
