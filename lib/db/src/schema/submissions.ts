import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const submissionsTable = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  property: text("property").notNull(),
  claim: text("claim").notNull(),
  product: text("product").notNull(),
  color: text("color").notNull(),
  notes: text("notes").notNull().default(""),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({
  id: true,
  submittedAt: true,
});

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
