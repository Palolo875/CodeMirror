import { 
  type User, 
  type InsertUser, 
  type Exploration, 
  type InsertExploration,
  type Feedback,
  type InsertFeedback 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Exploration methods
  createExploration(exploration: InsertExploration): Promise<Exploration>;
  getUserExplorations(userId: string): Promise<Exploration[]>;
  getExploration(id: string): Promise<Exploration | undefined>;
  deleteExploration(id: string): Promise<boolean>;
  
  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedback(): Promise<Feedback[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private explorations: Map<string, Exploration>;
  private feedbackList: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.explorations = new Map();
    this.feedbackList = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Exploration methods
  async createExploration(insertExploration: InsertExploration): Promise<Exploration> {
    const id = randomUUID();
    const exploration: Exploration = {
      ...insertExploration,
      id,
      userId: insertExploration.userId || null,
      createdAt: new Date()
    };
    this.explorations.set(id, exploration);
    return exploration;
  }

  async getUserExplorations(userId: string): Promise<Exploration[]> {
    return Array.from(this.explorations.values()).filter(
      (exploration) => exploration.userId === userId
    );
  }

  async getExploration(id: string): Promise<Exploration | undefined> {
    return this.explorations.get(id);
  }

  async deleteExploration(id: string): Promise<boolean> {
    return this.explorations.delete(id);
  }

  // Feedback methods
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      userId: insertFeedback.userId || null,
      comment: insertFeedback.comment || null,
      category: insertFeedback.category || null,
      createdAt: new Date()
    };
    this.feedbackList.set(id, feedback);
    return feedback;
  }

  async getFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbackList.values());
  }
}

export const storage = new MemStorage();
