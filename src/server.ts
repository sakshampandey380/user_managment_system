import app from "./app";
import { initializeDatabase } from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

void startServer().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
