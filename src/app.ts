import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { homeJsonResponse, renderHomePage } from "./views/home.view";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.status(200).send(renderHomePage());
    return;
  }

  res.status(200).json(homeJsonResponse);
});

app.get("/health", (_req, res) => {
  res.status(200).json(homeJsonResponse);
});

app.use(userRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
