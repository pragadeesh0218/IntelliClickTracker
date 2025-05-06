import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (keeping it from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Favorites table for saving favorite cities
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  cityId: text("city_id").notNull(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  cityId: true,
  name: true,
  country: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// City history table for tracking visited cities
export const cityHistory = pgTable("city_history", {
  id: serial("id").primaryKey(),
  cityId: text("city_id").notNull(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

export const insertHistorySchema = createInsertSchema(cityHistory).pick({
  cityId: true,
  name: true,
  country: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof cityHistory.$inferSelect;

// User settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tempUnit: text("temp_unit").default("celsius").notNull(),
  windUnit: text("wind_unit").default("kmh").notNull(),
  theme: text("theme").default("light").notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  tempUnit: true,
  windUnit: true,
  theme: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;
