import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "User Management Backend is running",
    endpoints: {
      register: "POST /register",
      login: "POST /login",
      getUser: "GET /users/:id",
      getUsers: "GET /users",
      blockUser: "PUT /users/:id/block"
    }
  });
});

app.use(userRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
