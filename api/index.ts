// Vercel serverless function entry point
import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
const httpServer = createServer(app);
registerRoutes(httpServer, app);

// Serve static files from dist/public
const distPath = path.resolve(process.cwd(), "dist", "public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Fallback to index.html for client-side routing (SPA)
  app.get("*", (_req: Request, res: Response) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
} else {
  // If dist/public doesn't exist, return error
  app.get("*", (_req: Request, res: Response) => {
    res.status(500).json({ error: "Build files not found. Please run 'npm run build' first." });
  });
}

// Export the Express app as a Vercel serverless function
export default app;
