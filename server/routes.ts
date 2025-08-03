import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ 
          message: "Un utilisateur avec ce nom d'utilisateur existe déjà" 
        });
      }

      const user = await storage.createUser(userData);
      res.status(201).json({ 
        id: user.id, 
        username: user.username 
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const validationError = fromZodError(error as any);
        return res.status(400).json({ 
          message: "Données invalides", 
          details: validationError.message 
        });
      }
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Feedback endpoint
  app.post("/api/feedback", (req, res) => {
    try {
      const { rating, comment, category } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          message: "La note doit être comprise entre 1 et 5" 
        });
      }

      // TODO: Store feedback in database
      // For now, just acknowledge receipt
      res.status(201).json({ 
        message: "Merci pour votre retour !",
        id: Date.now().toString()
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Journal/exploration endpoints
  app.post("/api/explorations", (req, res) => {
    try {
      const exploration = req.body;
      
      // Basic validation
      if (!exploration.question || !exploration.financialData) {
        return res.status(400).json({ 
          message: "Question et données financières requises" 
        });
      }

      // TODO: Store exploration in database
      // For now, return success with generated ID
      const explorationId = Date.now().toString();
      res.status(201).json({ 
        message: "Exploration sauvegardée avec succès",
        id: explorationId
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  app.get("/api/explorations", (req, res) => {
    try {
      // TODO: Fetch user's explorations from database
      // For now, return empty array
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Export functionality
  app.post("/api/export", (req, res) => {
    try {
      const { format, data } = req.body;
      
      if (!format || !data) {
        return res.status(400).json({ 
          message: "Format et données requis" 
        });
      }

      // TODO: Generate actual export file
      res.json({ 
        message: `Export ${format} généré avec succès`,
        downloadUrl: `/api/downloads/${Date.now()}.${format}`
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Error handling middleware
  app.use("/api/*", (req, res) => {
    res.status(404).json({ message: "Endpoint non trouvé" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
