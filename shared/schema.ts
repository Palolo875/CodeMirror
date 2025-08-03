import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const explorations = pgTable("explorations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  question: text("question").notNull(),
  financialData: jsonb("financial_data").notNull(),
  emotionalContext: jsonb("emotional_context").notNull(),
  insights: jsonb("insights").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertExplorationSchema = createInsertSchema(explorations).pick({
  userId: true,
  question: true,
  financialData: true,
  emotionalContext: true,
  insights: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  userId: true,
  rating: true,
  comment: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertExploration = z.infer<typeof insertExplorationSchema>;
export type Exploration = typeof explorations.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
