import { sql } from 'drizzle-orm'
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core'

export const galleryTable = sqliteTable('gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull(),
  providerId: text('provider_id'),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
})
