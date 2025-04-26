import express from "express";
import { bugService } from "./api/bug/bug.service.js";
import { loggerService } from "./services/logger.service.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));
} else {
  const corsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(cookieParser());
app.use(express.json());

import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { authRoutes } from "./api/auth/auth.routes.js";

app.use("/api/bug", bugRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const port = 3030;
app.listen(port, () => console.log(`Server ready a port ${port}`));
